'use client';

import cn from '@/utils/class-names';

export default function ButtonMain({
  children,
  isDisabled = false,
  label = '',
  clickFunction = () => {},
  className = '',
}) {
  return (
    <button
      className={cn(
        'block w-full bg-orange h-12 text-center rounded-[10px] text-white font-bold px-4',
        className,
      )}
      aria-label={label ? label : ''}
      disabled={isDisabled || false}
      onClick={clickFunction}
    >
      {children}
    </button>
  );
}
