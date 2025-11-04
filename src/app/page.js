'use client';

import { add } from '@/libs/counterSlice';
import { useAppDispatch } from '@/libs/hooks/use-app-dispatch';
import { useAppSelector } from '@/libs/hooks/use-app-selector';
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
    <div>
      <h1>Weekend Planner</h1>
      <p>Counter: {counter}</p>
      <button onClick={() => dispatch(add())}>Add 1 to counter</button>
    </div>
  );
}
