import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import cn from '@/utils/class-names';
import { nanoid } from '@reduxjs/toolkit';

export default function SliderContainer({ className = '', slides = [] }) {
  const slidesArr = slides.length
    ? slides
    : Array(5).fill({ url: '/images/event-placeholder.jpg' });

  const [swiper, setSwiper] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const updateNavState = (swiper) => {
    if (!swiper) return;
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <div
      className={cn(
        'max-w-[335px] md:max-w-[728px] lg:max-w-[1376px] w-full mx-auto relative',
        className,
      )}
    >
      <Swiper
        onSwiper={(swiper) => {
          setSwiper(swiper);
          updateNavState(swiper);
        }}
        onSlideChange={(swiper) => updateNavState(swiper)}
        onResize={(swiper) => swiper.update()}
        slidesPerView="auto"
        watchSlidesProgress
        watchOverflow
        spaceBetween={20}
        breakpoints={{
          768: { spaceBetween: 20 },
          1024: { spaceBetween: 32 },
        }}
        modules={[Navigation]}
        className="w-full overflow-visible"
      >
        {slidesArr.map((slid) => (
          <SwiperSlide key={nanoid()} className="w-auto!">
            <div className="w-[335px] h-[266px] md:w-[246px] lg:w-[496px]">
              <Link href="#">
                <Image
                  src={slid.url}
                  alt="Event"
                  width={496}
                  height={266}
                  className="rounded-xl w-full h-full object-cover"
                  loading="eager"
                />
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        className={cn(
          'absolute top-1/2 -translate-y-1/2 left-1 w-10 h-10 rounded-full flex items-center justify-center z-10 transition',
          isBeginning
            ? 'bg-white-dark opacity-40 cursor-default'
            : 'bg-white-dark hover:bg-blue-light cursor-pointer',
        )}
        onClick={() => swiper?.slidePrev()}
        disabled={isBeginning}
      >
        <ChevronLeft
          className={cn('w-5 h-5', isBeginning ? 'stroke-gray' : 'stroke-blue')}
        />
      </button>
      <button
        className={cn(
          'absolute top-1/2 -translate-y-1/2 right-1 w-10 h-10 bg-white-dark rounded-full flex items-center justify-center z-10 transition',
          isEnd
            ? 'opacity-40 cursor-default'
            : 'hover:bg-blue-light cursor-pointer',
        )}
        onClick={() => swiper?.slideNext()}
        disabled={isEnd}
      >
        <ChevronRight
          className={cn('w-5 h-5', isEnd ? 'stroke-gray' : 'stroke-blue')}
        />
      </button>
    </div>
  );
}
