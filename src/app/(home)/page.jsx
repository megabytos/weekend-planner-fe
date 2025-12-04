'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Container from '@/components/layout/container';
import SliderContainer from '@/components/layout/slider-container';
import ButtonMain from '@/components/ui/buttons/button-main';
import EventCardPreview from '@/components/ui/event-card-preview';
import EventPoster from '@/components/ui/event-poster';
import InputButton from '@/components/ui/input/input-button';
import useHomeData from '@/hooks/use-home-data';

export default function Home() {
  const router = useRouter();
  const { featured, popularEvents, popularPlaces, isLoading, isError } =
    useHomeData();

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
        <div>
          <h1 className="text-[22px] leading-7 mb-4 lg:text-[28px]">
            Top picks nearby
          </h1>
          {isError && (
            <p className="text-red">Failed to load items. Please try again.</p>
          )}
          <SliderContainer
            items={featured}
            renderItem={(itemObject) => <EventPoster item={itemObject} />}
          />
        </div>
        <div className="flex justify-center items-center">
          <ButtonMain
            className="w-[335px] md:w-[354px] lg:w-2xl"
            onClick={handleMainButton}
          >
            Ideas generation
          </ButtonMain>
        </div>
        <div className="">
          <h1 className="text-[22px] leading-7 mb-4 lg:text-[28px]">
            Popular events
          </h1>
          {isLoading && !popularEvents.length && (
            <p className="text-gray">Loading events…</p>
          )}
          <SliderContainer
            items={popularEvents}
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
          <h1 className="text-[22px] leading-7 mb-4">Popular places</h1>
          {isLoading && !popularPlaces.length && (
            <p className="text-gray">Loading places…</p>
          )}
          <SliderContainer
            items={popularPlaces}
            renderItem={(itemObject) => <EventCardPreview item={itemObject} />}
            isCardPreview={true}
          />
        </div>
      </div>
    </Container>
  );
}
