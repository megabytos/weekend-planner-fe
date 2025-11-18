'use client';

import Container from '@/components/layout/container';
import SliderContainer from '@/components/layout/slider-container';
import EventCardPreview from '@/components/ui/event-card-preview';
import EventPoster from '@/components/ui/event-poster';
import { useAppDispatch } from '@/libs/redux/hooks/use-app-dispatch';
import { useAppSelector } from '@/libs/redux/hooks/use-app-selector';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function Home() {
  const counter = useAppSelector((state) => state.counter.counter);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['todos'],
    queryFn: async () => (await fetch('/api/users')).json(),
  });

  // Mutations
  const mutation = useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const events = Array(5).fill({ url: '/images/event-placeholder.jpg' });

  return (
    <Container className="py-5 md:py-10 ">
      <div className="flex flex-col main-container gap-4 md:gap-5 lg:gap-8 ">
        <div className="content-center text-center">Search</div>
        <div className="content-center text-center">Ideas generation</div>
        <div className="">
          <SliderContainer
            items={events}
            renderItem={(itemObject) => <EventPoster item={itemObject} />}
          />
        </div>
        <div className="">
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
