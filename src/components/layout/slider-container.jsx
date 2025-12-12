'use client';

import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';

import cn from '@/utils/class-names';

import SliderNavigation from '../ui/slider-navigation';

export default function SliderContainer({
  items = [],
  renderItem,
  isCardPreview = false,
}) {
  const [swiper, setSwiper] = useState(null);
  const hasSlides = items && items.length > 0;

  return (
    <div
      className={cn(
        hasSlides
          ? 'max-w-[335px] md:max-w-[728px] lg:max-w-[1376px] w-full mx-auto relative'
          : 'w-[335px] md:w-[728px] lg:w-[1376px] mx-auto relative',
      )}
    >
      <Swiper
        onSwiper={(swiper) => {
          swiper.update();
          setSwiper(swiper);
        }}
        observer
        observeParents
        slidesPerView="auto"
        loop={items.length > 1}
        watchSlidesProgress
        watchOverflow
        spaceBetween={20}
        breakpoints={{
          768: { spaceBetween: 20 },
          1024: { spaceBetween: 32 },
        }}
        className="w-full overflow-visible"
      >
        {items.map((item, i) => (
          <SwiperSlide key={i} className="!w-auto">
            {renderItem(item)}
          </SwiperSlide>
        ))}
      </Swiper>
      {hasSlides && (
        <SliderNavigation swiper={swiper} isCardPreview={isCardPreview} />
      )}
    </div>
  );
}
