'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import cn from '@/utils/class-names';

import InputBase from './input-base';

export default function InputPassword({
  placeholder = 'Please enter ...',
  label,
  inputType = 'password',
  hint,
  error,
  hintId,
  errId,
  divClasses = '',
  inputClasses = '',
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={cn('w-full relative', divClasses)}>
      <InputBase
        inputType={showPassword ? 'text' : inputType}
        placeholder={placeholder}
        label={label}
        hint={hint}
        error={error}
        hintId={hintId}
        errId={errId}
        divClasses={divClasses}
        inputClasses={inputClasses}
      />

      <button
        type="button"
        onClick={handleClickShowPassword}
        className="absolute right-3.5 top-1/2"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        tabIndex={0}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
