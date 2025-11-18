'use client';

import cn from '@/utils/class-names';

export default function Button({
  children,
  isDisabled = false,
  label = '',
  onClick = () => {},
  className = '',
  ...rest
}) {
  return (
    <button
      className={cn(className)}
      aria-label={label ? label : ''}
      disabled={isDisabled || false}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
