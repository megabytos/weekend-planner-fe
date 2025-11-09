'use client';

import cn from '@/utils/class-names';

export default function ButtonIcon({
  children,
  isDisabled = false,
  label = '',
  clickFunction,
  className = '',
  ...rest
}) {
  return (
    <button
      className={cn(className)}
      aria-label={label ? label : ''}
      disabled={isDisabled || false}
      onClick={clickFunction}
      {...rest}
    >
      {children}
    </button>
  );
}
