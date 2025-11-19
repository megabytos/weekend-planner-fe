import { ChevronLeft, ChevronRight } from 'lucide-react';

import cn from '@/utils/class-names';

import Button from './buttons/button';

export default function SliderNavigation({ swiper, isCardPreview = false }) {
  return (
    <>
      <Button
        onClick={() => swiper?.slidePrev()}
        className={cn(
          'absolute  left-1 w-10 h-10 flex items-center justify-center rounded-full z-10 transition bg-white-dark hover:bg-blue-light cursor-pointer',
          isCardPreview ? 'top-36' : 'top-1/2 -translate-y-1/2',
        )}
      >
        <ChevronLeft className={cn('w-5 h-5 transition stroke-blue')} />
      </Button>
      <Button
        onClick={() => swiper?.slideNext()}
        className={cn(
          'absolute  right-1 w-10 h-10 flex items-center justify-center rounded-full z-10 transition bg-white-dark hover:bg-blue-light cursor-pointer',
          isCardPreview ? 'top-36' : 'top-1/2 -translate-y-1/2',
        )}
      >
        <ChevronRight className={cn('w-5 h-5 transition stroke-blue')} />
      </Button>
    </>
  );
}
