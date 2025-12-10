'use client';

import cn from '@/utils/class-names';

import Button from './button';

export default function PlannerButton({ onClick = () => {}, className = '' }) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        'text-blue bg-white-dark border border-blue rounded-xl px-2 py-1 hover:bg-blue-light',
        className,
      )}
    >
      Add to planner
    </Button>
  );
}
