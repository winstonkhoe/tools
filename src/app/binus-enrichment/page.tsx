'use client';
import axios from 'axios';
import { Input } from '@/components/Form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SiMicrosoftexcel } from 'react-icons/si';
import { FaXmark } from 'react-icons/fa6';
import { useDropzone } from 'react-dropzone';
import { SyncLoader } from 'react-spinners';

interface FormInputs {
  email: string;
  password: string;
}

export default function BinusEnrichment() {
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [lastAttemptSuccessful, setLastAttemptSuccessful] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileArrayBuffer, setFileArrayBuffer] = useState<any | null>(null);
  const methods = useForm<FormInputs>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = (data: any) => {
    const email = data?.email;
    const password = data?.password;
    if (file && fileArrayBuffer && email && password) {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('file', file);

      setIsLoading(true);
      axios
        .post(
          `${process.env.NEXT_PUBLIC_TOOLS_BACKEND_HOST}/tools/enrichment-automation/fill-logbook`,
          formData
        )
        .then((res) => {
          setLastAttemptSuccessful(true);
        })
        .catch((err) => {
          setLastAttemptSuccessful(false);
        })
        .finally(() => {
          setIsLoading(false);
          setAttemptCount(attemptCount + 1);
        });
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
    <div className='flex flex-1 justify-center items-center'>
      {isLoading && (
        <div className='fixed z-50 inset-0 flex flex-col gap-8 justify-center items-center w-full h-full bg-primary-grey/80'>
          <SyncLoader color='#DB8800' />
          <span className='font-semibold text-normal tracking-wider animate-wiggle dark:text-primary-white text-primary-white'>
            filling your logbook 🚀
          </span>
        </div>
      )}
      <div className='flex flex-col gap-6 w-72 sm:w-96'>
        {attemptCount > 0 && (
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
        )}

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
            <span className='text-sm font-semibold'>
              Download the template{' '}
              <a
                href='/presensi-sample.xlsx'
                className='transition-opacity opacity-80 hover:opacity-100 text-primary-yellow-300 dark:text-primary-yellow-100'
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
                    <span className='text-sm font-semibold'>
                      <span className='text-primary-yellow-300 dark:text-primary-yellow-100'>
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
            className='w-full py-2 text-base text-center font-bold rounded-lg disabled:opacity-20 disabled:cursor-not-allowed bg-primary-yellow-100 text-primary-grey opacity-80 hover:opacity-100'
            disabled={!file}
            onClick={methods.handleSubmit(onSubmit)}
          >
            Start Filling Your LogBook
          </button>
        </FormProvider>
      </div>
    </div>
  );
}
