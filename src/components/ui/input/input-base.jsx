'use client';

import cn from '@/utils/class-names';

export default function InputBase(
  {
    placeholder = 'Please enter ...',
    label = '',
    inputType = 'text',
    hint = '',
    error = '',
    hintId = '',
    errId = '',
    divClasses = '',
    inputClasses = '',
  },
  props,
) {
  return (
    <div className={cn('w-full relative', divClasses)}>
      {label && (
        <label
          htmlFor={label}
          className="block mb-1 text-xs leading-4 font-light text-black"
        >
          {label}
        </label>
      )}
      <input
        type={inputType}
        placeholder={placeholder}
        aria-invalid={!!error || undefined}
        aria-describedby={cn(hintId, errId)}
        className={cn(
          `border border-gray rounded-[10px] p-5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClasses}`,
          error ? 'border-red' : '',
        )}
      />
      {...props}
      {(hint || error) && (
        <div className="mt-1 text-xs">
          {hint && (
            <p id={hintId} className="text-blue">
              {hint}
            </p>
          )}
          {error && (
            <p id={errId} className="text-red">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
