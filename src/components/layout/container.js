import cn from '@/utils/class-names';

export default function Container({ className = '', children }) {
  return (
    <div
      className={cn(
        'w-full max-w-c[var(--container-max-width)] mx-auto px-5 lg:px-8 xl:px-0',
        className,
      )}
    >
      {children}
    </div>
  );
}
