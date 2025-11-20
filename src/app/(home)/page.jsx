'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Container from '@/components/layout/container';
import SliderContainer from '@/components/layout/slider-container';
import ButtonMain from '@/components/ui/buttons/button-main';
import EventCardPreview from '@/components/ui/event-card-preview';
import EventPoster from '@/components/ui/event-poster';
import InputButton from '@/components/ui/input/input-button';

export default function Home() {
  const router = useRouter();
  const events = Array(5).fill({
    url: '/images/event-placeholder.jpg',
  });

  const handleMainButton = () => {
    router.push('/search');
  };
  const handleSearch = () => {};

  return (
    <Container className="py-5 md:py-8 items-cente">
      <div className="font-medium flex flex-col justify-self-center gap-4 md:gap-5 lg:gap-8 max-w-[335px] md:max-w-[728px] lg:max-w-[1376px]">
        {false && (
          <>
            <div className="content-center text-center">
              <InputButton
                placeholder="Search events"
                submitFunction={handleSearch}
              >
                <Search />
              </InputButton>
            </div>
            <div className="flex justify-center items-center">Filters</div>
          </>
        )}
        <div className="flex justify-center items-center">
          <ButtonMain
            className="w-[335px] md:w-[354px] lg:w-2xl"
            onClick={handleMainButton}
          >
            Ideas generation
          </ButtonMain>
        </div>
        <div>
          <SliderContainer
            items={events}
            renderItem={(itemObject) => <EventPoster item={itemObject} />}
          />
        </div>
        <div className="">
          <h1 className="text-[22px] leading-7 mb-4 lg:text-[28px]">Popular</h1>
          <SliderContainer
            items={events}
            renderItem={(itemObject) => <EventCardPreview item={itemObject} />}
            isCardPreview={true}
          />
        </div>
        <div className="">
          <div className="bg-white-dark h-50 content-center text-center">
            Advertisement
          </div>
        </div>
        <div className="">
          <h1 className="text-[22px] leading-7 mb-4">New</h1>
          <SliderContainer
            items={events}
            renderItem={(itemObject) => <EventCardPreview item={itemObject} />}
            isCardPreview={true}
          />
        </div>
      </div>
    </Container>
  );
}
