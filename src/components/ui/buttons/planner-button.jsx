'use client';

import cn from '@/utils/class-names';

import Button from './button';

export default function PlannerButton({
  onClick = () => {},
  isActive = false,
  className = '',
}) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        ' border rounded-xl px-2 py-1 hover:bg-blue-light',
        isActive
          ? 'text-white bg-blue border-blue'
          : 'border-blue bg-white-dark text-blue',
        className,
      )}
    >
      {isActive ? 'Added' : 'Add to planner'}
    </Button>
  );
}
