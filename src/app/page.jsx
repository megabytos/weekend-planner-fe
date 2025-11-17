'use client';

import { Smile } from 'lucide-react';

import EventCard from '@/components/event-card';
import Container from '@/components/layout/container';
import SliderContainer from '@/components/layout/slider-container';
import EventPoster from '@/components/ui/event-poster';
import Icon from '@/components/ui/icon';
import { add } from '@/libs/redux/counterSlice';
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
    <Container className="py-10 ">
      <SliderContainer
        items={events}
        renderItem={(e) => <EventPoster slide={e} />}
      />
    </Container>
  );
}
