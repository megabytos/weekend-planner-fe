'use client';

import cn from '@/utils/class-names';

/**
 * InputBase component.
 *
 * @param {string} [placeholder='Please enter ...'] - Placeholder for the input field.
 * @param {string} [label=''] - Label for the input field.
 * @param {string} [inputType='text'] - Type of the input field.
 * @param {string} [hint=''] - Hint for the input field.
 * @param {string} [error=''] - Error message for the input field.
 * @param {string} [hintId=''] - Id for the hint element.
 * @param {string} [errId=''] - Id for the error element.
 * @param {string} [divClasses=''] - Classes for the outer div element.
 * @param {string} [inputClasses=''] - Classes for the input element.
 * @returns {JSX.Element} - JSX element containing the input field.
 */
export default function InputBase({
  placeholder = 'Please enter ...',
  label = '',
  inputType = 'text',
  hint = '',
  error = '',
  hintId = '',
  errId = '',
  divClasses = '',
  inputClasses = '',
}) {
  return (
    <div className={cn('h-12 relative', divClasses)}>
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
          `w-full h-full border border-gray rounded-[10px] py-3 px-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClasses}`,
          error ? 'border-red' : '',
        )}
      />
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
