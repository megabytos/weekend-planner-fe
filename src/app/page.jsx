'use client';

import { Smile } from 'lucide-react';

import Container from '@/components/layout/container';
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

  return (
    <Container>
      <h1>Weekend Planner</h1>
      <p>Counter: {counter}</p>
      <button onClick={() => dispatch(add())}>Add 1 to counter</button>
      <hr />
      Icon usage example:
      <Smile className="fill-yellow stroke-red" />
      <Icon
        className="fill-[var(--color-orange)]"
        name="logo-icon"
        width="200"
        height="40"
        ariaLabel="Logo"
      />
    </Container>
  );
}
