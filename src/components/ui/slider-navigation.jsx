import { ChevronLeft, ChevronRight } from 'lucide-react';

import cn from '@/utils/class-names';

import ButtonIcon from './button-icon';

export default function SliderNavigation({
  swiper,
  isBeginning,
  isEnd,
  isCardPreview = false,
}) {
  return (
    <>
      <ButtonIcon
        clickFunction={() => swiper?.slidePrev()}
        disabled={isBeginning}
        className={cn(
          'absolute  left-1 w-10 h-10 flex items-center justify-center rounded-full z-10 transition',
          isBeginning
            ? 'bg-white-dark opacity-40 cursor-default'
            : 'bg-white-dark hover:bg-blue-light cursor-pointer',
          isCardPreview ? 'top-36' : 'top-1/2 -translate-y-1/2',
        )}
      >
        <ChevronLeft
          className={cn(
            'w-5 h-5 transition',
            isBeginning ? 'stroke-gray' : 'stroke-blue',
          )}
        />
      </ButtonIcon>
      <ButtonIcon
        clickFunction={() => swiper?.slideNext()}
        disabled={isEnd}
        className={cn(
          'absolute  right-1 w-10 h-10 flex items-center justify-center rounded-full z-10 transition',
          isEnd
            ? 'bg-white-dark opacity-40 cursor-default'
            : 'bg-white-dark hover:bg-blue-light cursor-pointer',
          isCardPreview ? 'top-36' : 'top-1/2 -translate-y-1/2',
        )}
      >
        <ChevronRight
          className={cn(
            'w-5 h-5 transition',
            isEnd ? 'stroke-gray' : 'stroke-blue',
          )}
        />
      </ButtonIcon>
    </>
  );
}
