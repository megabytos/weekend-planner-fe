'use client';

import cn from '@/utils/class-names';

import InputBase from './input-base';

/**
 * InputField component.
 * @param {Object} props - Component props
 * @param {string} [props.placeholder='Please enter ...'] - Placeholder for the input field.
 * @param {string} [props.label=''] - Label for the input field.
 * @param {string} [props.inputType='text'] - Type of the input field.
 * @param {string} [props.hint=''] - Hint for the input field.
 * @param {string} [props.error=''] - Error message for the input field.
 * @param {string} [props.hintId=''] - Id for the hint element.
 * @param {string} [props.errId=''] - Id for the error element.
 * @param {function} [props.submitFunction=() => {}] - Function to be called when the input field is submitted.
 * @param {string} [props.nestedDivClasses=''] - Classes for the nested div element.
 * @param {string} [props.divClasses=''] - Classes for the outer div element.
 * @param {string} [props.inputClasses=''] - Classes for the input element.
 * @param {React.ReactNode} props.children - Children elements.
 * @returns {React.JSX.Element} - JSX element containing the input field and optional end icon button.
 * !! example <InputButton endIcon={true}>
 * !!      <Search className="w-6 h-6" />
 * !!     </InputButton>
 */
export default function InputButton({
  placeholder = 'Please enter ...',
  label = '',
  inputType = 'text',
  hint = '',
  error = '',
  hintId = '',
  errId = '',
  submitFunction = () => {},
  nestedDivClasses = '',
  divClasses = '',
  inputClasses = '',
  children,
}) {
  return (
    <div className={cn('h-12 relative', divClasses)}>
      <InputBase
        inputType={inputType}
        placeholder={placeholder}
        label={label}
        hint={hint}
        error={error}
        hintId={hintId}
        errId={errId}
        divClasses={nestedDivClasses}
        inputClasses={inputClasses}
      />

      <button
        type="submit"
        onClick={() => submitFunction?.()}
        className="cursor-pointer absolute right-3.5 top-1/2 transform translate-y-1/2 "
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </button>
    </div>
  );
}
