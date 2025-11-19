'use client';

import cn from '@/utils/class-names';

/**
 * InputBase component.
 * @param {Object} props - Component props
 * @param {string} [props.placeholder='Please enter ...'] - Placeholder for the input field.
 * @param {string} [props.label=''] - Label for the input field.
 * @param {string} [props.inputType='text'] - Type of the input field.
 * @param {string} [props.hint=''] - Hint for the input field.
 * @param {string} [props.error=''] - Error message for the input field.
 * @param {string} [props.hintId=''] - Id for the hint element.
 * @param {string} [props.errId=''] - Id for the error element.
 * @param {string} [props.divClasses=''] - Classes for the outer div element.
 * @param {string} [props.inputClasses=''] - Classes for the input element.
 * @returns {React.JSX.Element} - JSX element containing the input field.
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
  ...inputProps
}) {
  return (
    <div className={cn('relative', divClasses)}>
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
          `block w-full h-12 bg-white-dark border border-white-dark rounded-[10px] py-3 px-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClasses}`,
          error ? 'border-red' : '',
        )}
        {...inputProps}
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
