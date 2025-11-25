'use client';

import { Loader } from 'lucide-react';

import cn from '@/utils/class-names';

import Button from './button';

export default function ButtonMain({
  children,
  isLoading = false,
  isDisabled = false,
  label = '',
  onClick = () => {},
  className = '',
}) {
  return (
    <Button
      className={cn(
        'flex justify-center items-center w-full bg-orange h-12 text-center rounded-[10px] text-white font-bold px-4',
        className,
      )}
      aria-label={label ? label : ''}
      isDisabled={isDisabled}
      onClick={onClick}
    >
      {isLoading && <Loader className="animate-spin mr-2" />}
      {children}
    </Button>
  );
}
