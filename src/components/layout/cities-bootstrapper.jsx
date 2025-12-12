'use client';

import { useEffect } from 'react';

import { useAppDispatch } from '@/libs/redux/hooks/use-app-dispatch';
import { fetchCitiesIfNeeded } from '@/libs/redux/slices/cities-slice';

export default function CitiesBootstrapper() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // App-level bootstrap: refresh with 24h TTL policy
    dispatch(fetchCitiesIfNeeded({ reason: 'app' }));
  }, [dispatch]);

  return null;
}
