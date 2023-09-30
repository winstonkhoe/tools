import { HTMLInputTypeAttribute, useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  type?: HTMLInputTypeAttribute | undefined;
  id?: string;
  name: string;
  className?: string;
  numberOnly?: boolean;
  onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const Input = ({
  type,
  className,
  name,
  numberOnly = false,
  onInput,
  ...props
}: Props) => {
  const { register } = useFormContext();
  const [isFocus, setIsFocus] = useState<Boolean>(false);

  return (
    <>
      {type === 'textarea' ? (
        <textarea {...register(name!)} />
      ) : (
        <div className={`relative w-full`}>
          <div
            className={`absolute bottom-0 left-0 z-20 border-b-2 border-b-primary-yellow-200 dark:border-b-primary-yellow-100 transition-all duration-500 ${
              isFocus ? 'w-full' : 'w-0'
            }`}
          ></div>
          <div
            className={`absolute bottom-0 left-0 z-10 w-full border-b-2 border-b-primary-grey/40 dark:border-b-slate-200`}
          ></div>
          <input
            {...props}
            {...register(name!)}
            type={type}
            className={`w-full appearance-none ${
              className ? `${className} ` : ''
            }text-base text-primary-black dark:text-primary-white bg-transparent autofill:bg-transparent focus:bg-transparent rounded-none py-2 outline-none focus:outline-none`}
            onFocus={() => {
              setIsFocus(true);
            }}
            onBlur={() => {
              setIsFocus(false);
            }}
            onInput={
              numberOnly || type === 'number' || type === 'tel'
                ? (event: React.ChangeEvent<HTMLInputElement>) => {
                    const intValue = parseInt(`${event.target.value}`);
                    event.target.value = `${intValue ? intValue : ''}`;
                  }
                : onInput
            }
          />
        </div>
      )}
    </>
  );
};

export { Input };
