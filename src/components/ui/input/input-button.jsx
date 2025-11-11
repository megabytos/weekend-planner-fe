'use client';

import cn from '@/utils/class-names';

import InputBase from './input-base';

export default function InputField({
  placeholder = 'Please enter ...',
  label,
  inputType = 'text',
  hint,
  error,
  hintId,
  errId,
  endIcon,
  submitFunction,
  divClasses = '',
  inputClasses = '',
}) {
  return (
    <div className={cn('w-full relative', divClasses)}>
      <InputBase
        inputType={inputType}
        placeholder={placeholder}
        label={label}
        hint={hint}
        error={error}
        hintId={hintId}
        errId={errId}
        divClasses={divClasses}
        inputClasses={inputClasses}
      />
      {endIcon && (
        <button
          type="submit"
          onClick={submitFunction}
          className="absolute right-3.5 top-1/2"
          aria-label={label}
          tabIndex={0}
        ></button>
      )}
    </div>
  );
}
