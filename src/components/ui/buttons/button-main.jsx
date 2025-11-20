'use client';

import cn from '@/utils/class-names';

import Button from './button';

export default function ButtonMain({
  children,
  isDisabled = false,
  label = '',
  onClick = () => {},
  className = '',
}) {
  return (
    <Button
      className={cn(
        'block w-full bg-orange h-12 text-center rounded-[10px] text-white font-bold px-4',
        className,
      )}
      aria-label={label ? label : ''}
      isDisabled={isDisabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
