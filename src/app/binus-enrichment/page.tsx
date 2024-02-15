'use client';
import { Input } from '@/components/Form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SiMicrosoftexcel } from 'react-icons/si';
import { FaXmark } from 'react-icons/fa6';
import { useDropzone } from 'react-dropzone';
import { SyncLoader } from 'react-spinners';
import { SOCKET_EVENT } from '@/utils/constants';
import { useSocket } from '@/contexts/Socket';
import { Month, getFormattedDate, months } from '@/utils/date-time';
import { AiFillInfoCircle } from 'react-icons/ai';
import { MdCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md';
import { IoChevronDown } from 'react-icons/io5';

interface FormInputs {
  email: string;
  password: string;
}

interface ErrorResponse {
  errorMessage: string;
}

interface StatusLog {
  status: string;
  timestamp: number;
}

interface DropdownProps {
  text: string;
  value: string | number;
}

export type PeriodSemesterType = 'odd' | 'even';

interface Period {
  text: string;
  type: PeriodSemesterType;
  value: number;
}

type PeriodType = {
  [key in PeriodSemesterType]: Period;
};

const periodType: PeriodType = {
  odd: {
    text: 'Odd Semester',
    type: 'odd',
    value: 10
  },
  even: {
    text: 'Even Semester',
    type: 'even',
    value: 20
  }
};

export default function BinusEnrichment() {
  const [socket] = useSocket();
  const [selectedMonths, setSelectedMonths] = useState<DropdownProps[]>([]);
  const periods = useMemo<Period[]>(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear + 1]
      .map((year): Period[] => {
        const startOddYear = year - 2;
        const endOddYear = year - 1;
        const startEvenYear = year - 1;
        const endEvenYear = year;
        const BinusianYear = `B${endEvenYear % 1000}`;
        return [
          {
            text: `${periodType.odd.text} ${startOddYear}/${endOddYear} (${BinusianYear})`,
            type: 'odd',
            value: parseInt(`${startOddYear % 1000}${periodType.odd.value}`, 10)
          },
          {
            text: `${periodType.even.text} ${startEvenYear}/${endEvenYear} (${BinusianYear})`,
            type: 'even',
            value: parseInt(
              `${startEvenYear % 1000}${periodType.even.value}`,
              10
            )
          }
        ];
      })
      .flat();
  }, []);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(
    periods[2]
  );
  const [errorResponse, setErrorResponse] = useState<ErrorResponse | undefined>(
    undefined
  );
  const [statusLogs, setStatusLogs] = useState<StatusLog[]>([]);
  const [lastAttemptSuccessful, setLastAttemptSuccessful] =
    useState<boolean>();
  const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] =
    useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileArrayBuffer, setFileArrayBuffer] = useState<any | null>(null);
  const methods = useForm<FormInputs>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    const finishFillLogBook = () => {
      setIsLoading(false);
    };

    const onFillLogBookStatus = (status: string, timestamp: number) => {
      setStatusLogs([...statusLogs, { status, timestamp }]);
    };

    const onFillLogBookSuccess = () => {
      finishFillLogBook();
      setLastAttemptSuccessful(true);
    };

    const onFillLogBookError = () => {
      finishFillLogBook();
      setLastAttemptSuccessful(false);
    };

    socket.on(
      SOCKET_EVENT.enrichmentAutomation.fillLogBook.status,
      onFillLogBookStatus
    );
    socket.on(
      SOCKET_EVENT.enrichmentAutomation.fillLogBook.success,
      onFillLogBookSuccess
    );
    socket.on(
      SOCKET_EVENT.enrichmentAutomation.fillLogBook.error,
      onFillLogBookError
    );

    return () => {
      socket.off(
        SOCKET_EVENT.enrichmentAutomation.fillLogBook.status,
        onFillLogBookStatus
      );
      socket.off(
        SOCKET_EVENT.enrichmentAutomation.fillLogBook.success,
        onFillLogBookSuccess
      );
      socket.off(
        SOCKET_EVENT.enrichmentAutomation.fillLogBook.error,
        onFillLogBookError
      );
    };
  }, [socket, statusLogs]);

  const onSubmit = (data: any) => {
    const email = data?.email;
    const password = data?.password;
    const monthsSelected = selectedMonths?.map((month: DropdownProps) => {
      return month.value;
    });
    const periodSelected = selectedPeriod.value
    if (file && fileArrayBuffer && email && password && periodSelected) {
      socket.emit(
        'enrichment-automation.fill-logbook',
        email,
        password,
        file,
        monthsSelected,
        periodSelected
      );
      setIsLoading(true);
      setLastAttemptSuccessful(undefined);
    }
  };

  useEffect(() => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e: any) => {
        const bufferArray = e?.target.result;
        setFileArrayBuffer(bufferArray);
      };

      fileReader.onerror = (error) => {
        setFile(null);
        setFileArrayBuffer(null);
      };
    }
  }, [file]);

  const onDrop = useCallback((acceptedFiles: any) => {
    setFile(acceptedFiles[0]);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
    noClick: true
  });

  return (
    <div className='flex flex-1 justify-center items-center pt-4 pb-10'>
      <div className='flex flex-col gap-6 w-72 sm:w-96'>
        <div className='flex items-center gap-3 bg-primary-yellow-100/70 p-3 rounded-lg'>
          <span className='text-2xl'>
            <AiFillInfoCircle />
          </span>
          <span className='font-mono font-semibold text-xs text-primary-black lowercase'>
            This application will never save any information
          </span>
        </div>
        {lastAttemptSuccessful !== undefined && (
          <div className='flex flex-col gap-1'>
            <div className='flex justify-center gap-4'>
              <h2 className='text-center font-bold lowercase'>Last Attempt</h2>
              {lastAttemptSuccessful ? (
                <h2 className='text-center font-bold lowercase text-primary-green-400'>
                  success
                </h2>
              ) : (
                <h2 className='text-center font-bold lowercase text-primary-red-300'>
                  failed
                </h2>
              )}
            </div>
            {!lastAttemptSuccessful && errorResponse && (
              <div className='flex justify-center'>
                <span className='text-xs font-semibold lowercase text-primary-red-300 opacity-80'>
                  {errorResponse?.errorMessage}
                </span>
              </div>
            )}
          </div>
        )}
        <div
          className={`cursor-pointer box-border relative flex gap-3 bg-primary-white dark:bg-primary-grey p-3 transition-all ${
            isSemesterDropdownOpen ? 'rounded-t' : 'rounded'
          }`}
          onClick={(event) => {
            event.stopPropagation();
            setIsSemesterDropdownOpen(!isSemesterDropdownOpen);
          }}
        >
          <div className='flex w-full flex-wrap gap-3'>
            <span className='font-mono lowercase'>{selectedPeriod.text}</span>
          </div>
          <div
            className={`flex items-center transition-transform ${
              isSemesterDropdownOpen ? '-rotate-180' : ''
            }`}
          >
            <IoChevronDown />
          </div>
          <div
            className={`absolute z-50 w-full flex flex-col left-0 top-full rounded-b bg-primary-white dark:bg-primary-grey transition-all scrollbar-thin scrollbar-track-primary-grey/30 scrollbar-thumb-primary-black dark:scrollbar-track-primary-white/10 dark:scrollbar-thumb-primary-yellow-100/70 ${
              isSemesterDropdownOpen
                ? 'max-h-96 overflow-y-auto'
                : 'max-h-0 overflow-hidden'
            }`}
          >
            {periods?.map((period: Period, index: number) => {
              const periodIsSelected = period.value === selectedPeriod.value;
              return (
                <div
                  className={`flex items-center gap-3 w-full py-2 px-4 cursor-pointer transition-colors text-lg ${
                    periodIsSelected
                      ? 'bg-primary-yellow-100/40 hover:bg-primary-yellow-100/40'
                      : 'hover:bg-primary-yellow-100/20 '
                  }`}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (selectedPeriod !== period) {
                      setSelectedPeriod(period);
                      setSelectedMonths([]);
                    }
                    setIsSemesterDropdownOpen(false);
                  }}
                  key={`${index}-${period.value}`}
                >
                  <span className='font-mono font-semibold lowercase text-primary-black dark:text-primary-white'>
                    {period.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div
          className={`cursor-pointer box-border relative flex gap-3 bg-primary-white dark:bg-primary-grey p-3 transition-all ${
            isDropdownOpen ? 'rounded-t' : 'rounded'
          }`}
          onClick={(event) => {
            event.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
        >
          <div className='flex w-full flex-wrap gap-3'>
            {selectedMonths.length > 0 ? (
              selectedMonths.map(
                (selectedMonth: DropdownProps, index: number) => {
                  return (
                    <div
                      key={`${index}-${selectedMonth?.value}`}
                      className='flex items-center gap-2 bg-primary-yellow-100 px-3 py-2 rounded text-xs font-mono font-semibold lowercase text-primary-black'
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedMonths(
                          selectedMonths?.filter(
                            (month) => month?.value !== selectedMonth?.value
                          )
                        );
                      }}
                    >
                      <span className=''>{selectedMonth?.text}</span>
                      <span className=''>
                        <FaXmark />
                      </span>
                    </div>
                  );
                }
              )
            ) : (
              <span className='font-mono lowercase'>Choose Logbook Month</span>
            )}
          </div>
          <div
            className={`flex items-center transition-transform ${
              isDropdownOpen ? '-rotate-180' : ''
            }`}
          >
            <IoChevronDown />
          </div>
          <div
            className={`absolute z-50 w-full flex flex-col left-0 top-full rounded-b bg-primary-white dark:bg-primary-grey transition-all scrollbar-thin scrollbar-track-primary-grey/30 scrollbar-thumb-primary-black dark:scrollbar-track-primary-white/10 dark:scrollbar-thumb-primary-yellow-100/70 ${
              isDropdownOpen
                ? 'max-h-96 overflow-y-auto'
                : 'max-h-0 overflow-hidden'
            }`}
          >
            {months
              .filter(
                (m) =>
                  m.period.find((mp) => mp === selectedPeriod.type) !==
                  undefined
              )
              ?.map((month: Month, index: number) => {
                return (
                  <div
                    className={`flex items-center gap-3 w-full py-2 px-4 cursor-pointer hover:bg-primary-yellow-100/40 transition-colors text-lg ${
                      selectedMonths?.find(
                        (selectedMonth) => selectedMonth?.value === month.text
                      )
                        ? 'bg-primary-yellow-100/40'
                        : ''
                    }`}
                    onClick={(event) => {
                      event.stopPropagation();
                      const selectedMonth = selectedMonths?.find(
                        (selectedMonth) => selectedMonth?.value === month.text
                      );
                      if (selectedMonth) {
                        setSelectedMonths(
                          selectedMonths?.filter(
                            (selectedMonth) =>
                              selectedMonth?.value !== month.text
                          )
                        );
                      } else {
                        setSelectedMonths([
                          ...selectedMonths,
                          { text: month.text, value: month.text }
                        ]);
                      }
                    }}
                    key={`${index}-${month}`}
                  >
                    <span>
                      {selectedMonths?.find(
                        (selectedMonth) => selectedMonth?.value === month.text
                      ) ? (
                        <MdCheckBox />
                      ) : (
                        <MdCheckBoxOutlineBlank />
                      )}
                    </span>
                    <span className='font-mono font-semibold lowercase text-primary-black dark:text-primary-white'>
                      {month.text}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
        <FormProvider {...methods}>
          <Input
            name='email'
            type='email'
            placeholder='Email'
          />
          <Input
            name='password'
            type='password'
            placeholder='Password'
          />

          <div className='flex flex-col gap-2'>
            <span className='text-sm font-mono'>
              Download the template{' '}
              <a
                href='/presensi-sample.xlsx'
                className='font-semibold transition-opacity opacity-80 hover:opacity-100 text-primary-yellow-300 dark:text-primary-yellow-100'
              >
                here
              </a>
            </span>
            {file ? (
              <div className='flex items-center justify-between w-full border border-primary-yellow-300 dark:border-primary-yellow-100 rounded px-2 py-1'>
                <span className='text-sm font-medium dark:text-primary-white/80 text-primary-black/80'>
                  {file?.name}
                </span>
                <div
                  className='px-2 py-1 text-lg transition-opacity opacity-60 hover:opacity-100 text-primary-yellow-300 dark:text-primary-yellow-100 cursor-pointer'
                  onClick={() => {
                    setFile(null);
                  }}
                >
                  <FaXmark />
                </div>
              </div>
            ) : (
              <>
                {' '}
                <label
                  htmlFor='file'
                  {...getRootProps()}
                >
                  <div
                    className={`flex flex-col gap-2 justify-center items-center w-full rounded border border-dashed border-primary-black/30 dark:border-primary-white/70 p-6 ${
                      isDragActive
                        ? 'bg-primary-yellow-100/30 dark:bg-primary-yellow-100/30'
                        : ''
                    }`}
                  >
                    <span className='text-2xl opacity-60'>
                      <SiMicrosoftexcel />
                    </span>
                    <span className='text-sm font-mono'>
                      <span className='font-semibold text-primary-yellow-300 dark:text-primary-yellow-100'>
                        Select file
                      </span>{' '}
                      <span className='opacity-60'>or drop your file here</span>
                    </span>
                  </div>
                </label>
                <input
                  id='file'
                  name='file'
                  type='file'
                  className='hidden w-0 h-0'
                  {...getInputProps()}
                  onChange={(event) => {
                    const f = event.target.files?.[0];
                    setFile(f || null);
                  }}
                />
              </>
            )}
          </div>
          <button
            className='w-full py-2 text-base text-center font-mono font-bold rounded-lg disabled:opacity-20 disabled:cursor-not-allowed bg-primary-yellow-100 text-primary-grey opacity-80 hover:opacity-100'
            disabled={!file || isLoading}
            onClick={methods.handleSubmit(onSubmit)}
          >
            Start Filling Your LogBook
          </button>
        </FormProvider>
        <div className='flex flex-col rounded overflow-hidden mt-4'>
          <div className='w-full flex justify-between px-4 py-2 bg-primary-yellow-300/70'>
            <h4 className='font-mono font-semibold lowercase text-primary-white'>
              Event Logs
            </h4>
            {isLoading && (
              <SyncLoader
                size={8}
                color='#fff'
              />
            )}
          </div>
          <div className='w-full flex flex-col gap-6 py-4 px-2 max-h-72 bg-primary-grey/10 dark:bg-primary-grey/50 overflow-y-auto scrollbar-thin scrollbar-track-primary-grey/30 scrollbar-thumb-primary-black dark:scrollbar-track-primary-white/10 dark:scrollbar-thumb-primary-yellow-100/70'>
            {statusLogs?.map((statusLog: StatusLog, index: number) => {
              const { date, time } = getFormattedDate(
                new Date(statusLog?.timestamp)
              );
              return (
                <div
                  className='flex w-full items-start gap-2'
                  key={`${index}-${statusLog?.status}-${statusLog?.timestamp}`}
                >
                  <div className='flex flex-col'>
                    <span className='text-sm font-mono tracking-wider text-primary-yellow-300 dark:text-primary-yellow-100 opacity-80'>
                      {time}
                    </span>
                    <span className='text-xs font-mono text-primary-black dark:text-primary-white opacity-60'>
                      {date}
                    </span>
                  </div>
                  <span className='text-xs font-mono tracking-wider text-primary-black dark:text-primary-white opacity-80 break-words'>
                    {statusLog?.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
