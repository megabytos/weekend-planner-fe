'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import cn from '@/utils/class-names';

import InputBase from './input-base';

/**
 * InputPassword component.
 * @param {Object} props - Component props
 * @param {string} [props.placeholder='Password'] - Placeholder for the input field.
 * @param {string} [props.label=''] - Label for the input field.
 * @param {string} [props.inputType='password'] - Type of the input field.
 * @param {string} [props.hint=''] - Hint for the input field.
 * @param {string} [props.error=''] - Error message for the input field.
 * @param {string} [props.hintId=''] - Id for the hint element.
 * @param {string} [props.errId=''] - Id for the error element.
 * @param {string} [props.nestedDivClasses=''] - Classes for the nested div element.
 * @param {string} [props.divClasses=''] - Classes for the outer div element.
 * @param {string} [props.inputClasses=''] - Classes for the input element.
 * @returns {React.JSX.Element} - JSX element containing the input field and show/hide password button.
 */
export default function InputPassword({
  placeholder = 'Password',
  label = '',
  inputType = 'password',
  hint = '',
  error = '',
  hintId = '',
  errId = '',
  nestedDivClasses = '',
  divClasses = '',
  inputClasses = '',
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={cn('relative', divClasses)}>
      <InputBase
        inputType={showPassword ? 'text' : inputType}
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
        type="button"
        onClick={handleClickShowPassword}
        className="w-6 h-6 cursor-pointer absolute right-3.5 top-11 transform -translate-y-1/2"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        tabIndex={0}
      >
        {showPassword ? (
          <EyeOff className="h-6 w-6" />
        ) : (
          <Eye className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
