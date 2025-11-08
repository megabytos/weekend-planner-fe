'use client';

import cn from '@/utils/class-names';

export default function Button({
  children,
  isDisabled,
  label,
  clickFunction,
  classes,
}) {
  return (
    <button
      className={cn(classes)}
      aria-label={label ? label : ''}
      disabled={isDisabled || false}
      onClick={clickFunction}
    >
      {children}
    </button>
  );
}
