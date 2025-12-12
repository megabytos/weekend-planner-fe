'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Container from '@/components/layout/container';
import SliderContainer from '@/components/layout/slider-container';
import ButtonMain from '@/components/ui/buttons/button-main';
import EventCardPreview from '@/components/ui/event-card-preview';
import EventPoster from '@/components/ui/event-poster';
import InputButton from '@/components/ui/input/input-button';
import Loader from '@/components/ui/loader';
import useHomeData from '@/hooks/use-home-data';
import { useAppDispatch } from '@/libs/redux/hooks/use-app-dispatch';
import { useAppSelector } from '@/libs/redux/hooks/use-app-selector';
import { fetchCitiesIfNeeded } from '@/libs/redux/slices/cities-slice';
import { selectFilter } from '@/libs/redux/slices/filter-slice';
import { DEFAULT_CITY } from '@/utils/params-builder';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const { featured, popularEvents, popularPlaces, isLoading, isError } =
    useHomeData(filter);
  const cityName = filter.city?.name || DEFAULT_CITY.city.name;
  const popular = popularEvents.length;
  console.log(popular);
  // Trigger home refresh for cities (throttled 60s)
  useEffect(() => {
    dispatch(fetchCitiesIfNeeded({ reason: 'home' }));
  }, [dispatch]);

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
        {isLoading && !popularEvents.length && (
          <div className="flex items-center justify-center w-[335px] h-[266px] md:w-[728px] lg:w-[1376px]">
            <Loader />
            <p className=" text-center text-gray">Top picks in {cityName}</p>
          </div>
        )}
        {!isLoading && (
          <div>
            {isError && (
              <p className="text-red">
                Failed to load items. Please try again.
              </p>
            )}
            <h1 className="text-[22px] leading-7 mb-4 lg:text-[28px]">
              Top picks in {cityName}
            </h1>
            <SliderContainer
              items={featured}
              renderItem={(itemObject) => <EventPoster item={itemObject} />}
            />
          </div>
        )}

        <div className="flex justify-center items-center">
          <ButtonMain
            className="w-[335px] md:w-[354px] lg:w-2xl"
            onClick={handleMainButton}
          >
            Generate Ideas
          </ButtonMain>
        </div>

        {isLoading && !popularEvents.length && (
          <div className="flex items-center justify-center w-[335px] h-[266px] md:w-[728px] lg:w-[1376px]">
            <Loader />
            <p className=" text-center text-gray">Loading events…</p>
          </div>
        )}
        {popularEvents.length < 0 && (
          <div>
            <h1 className="text-[22px] leading-7 mb-4 lg:text-[28px]">
              Popular events in {cityName}
            </h1>
            <SliderContainer
              items={popularEvents}
              renderItem={(itemObject) => (
                <EventCardPreview item={itemObject} />
              )}
              isCardPreview={true}
            />
          </div>
        )}

        <div>
          <div className="bg-white-dark h-50 content-center text-center">
            Advertisement
          </div>
        </div>

        {isLoading && !popularPlaces.length && (
          <div className="flex items-center justify-center w-[335px] h-[266px] md:w-[728px] lg:w-[1376px]">
            <Loader />
            <p className=" text-center text-gray">Loading places…</p>
          </div>
        )}
        {popularPlaces.length > 0 && (
          <div>
            <h1 className="text-[22px] leading-7 mb-4">
              Popular places in {cityName}
            </h1>
            <SliderContainer
              items={popularPlaces}
              renderItem={(itemObject) => (
                <EventCardPreview item={itemObject} />
              )}
              isCardPreview={true}
            />
          </div>
        )}
      </div>
    </Container>
  );
}
