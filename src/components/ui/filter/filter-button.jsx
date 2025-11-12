// components/ui/Pill.tsx
import { cn } from '@/utils/class-names';

export function Pill({ selected, children, clickFunction, classes }) {
  return (
    <button
      type="button"
      onClick={clickFunction}
      className={cn(
        'px-3 py-1.5 rounded-2xl border text-sm transition',
        selected
          ? 'bg-blue-50 text-blue-700 border-blue-300'
          : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        classes,
      )}
    >
      {children}
    </button>
  );
}
