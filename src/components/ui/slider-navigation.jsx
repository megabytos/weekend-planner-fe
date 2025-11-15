import { ChevronLeft, ChevronRight } from 'lucide-react';

import cn from '@/utils/class-names';

export default function SliderNavigation({ swiper, isBeginning, isEnd }) {
  return (
    <>
      <button
        onClick={() => swiper?.slidePrev()}
        disabled={isBeginning}
        className={cn(
          'absolute top-1/2 -translate-y-1/2 left-1 w-10 h-10 flex items-center justify-center rounded-full z-10 transition',
          isBeginning
            ? 'bg-white-dark opacity-40 cursor-default'
            : 'bg-white-dark hover:bg-blue-light cursor-pointer',
        )}
      >
        <ChevronLeft
          className={cn(
            'w-5 h-5 transition',
            isBeginning ? 'stroke-gray' : 'stroke-blue',
          )}
        />
      </button>
      <button
        onClick={() => swiper?.slideNext()}
        disabled={isEnd}
        className={cn(
          'absolute top-1/2 -translate-y-1/2 right-1 w-10 h-10 flex items-center justify-center rounded-full z-10 transition',
          isEnd
            ? 'bg-white-dark opacity-40 cursor-default'
            : 'bg-white-dark hover:bg-blue-light cursor-pointer',
        )}
      >
        <ChevronRight
          className={cn(
            'w-5 h-5 transition',
            isEnd ? 'stroke-gray' : 'stroke-blue',
          )}
        />
      </button>
    </>
  );
}
