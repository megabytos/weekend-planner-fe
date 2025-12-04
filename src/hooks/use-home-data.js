'use client';

import { useMemo } from 'react';

import { useSearchQuery } from '@/hooks/use-search-query';
import buildSearchParams from '@/utils/params-builder';

const DEFAULT_LIMIT = 12;

const extractItems = (data) =>
  Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];

const useHomeData = () => {
  const eventsParams = useMemo(
    () =>
      buildSearchParams({
        page: 1,
        filter: { target: 'events' },
        limit: DEFAULT_LIMIT,
      }),
    [],
  );

  const placesParams = useMemo(
    () =>
      buildSearchParams({
        page: 1,
        filter: { target: 'places' },
        limit: DEFAULT_LIMIT,
      }),
    [],
  );

  const eventsQuery = useSearchQuery(eventsParams, {
    staleTime: 1000 * 60 * 5,
  });
  const placesQuery = useSearchQuery(placesParams, {
    staleTime: 1000 * 60 * 5,
  });

  const popularEvents = useMemo(
    () => extractItems(eventsQuery.data),
    [eventsQuery.data],
  );
  const popularPlaces = useMemo(
    () => extractItems(placesQuery.data),
    [placesQuery.data],
  );

  const featured = useMemo(() => {
    if (!popularEvents.length && !popularPlaces.length) {
      return [];
    }
    const topPlaces = popularPlaces.slice(0, 3);
    const topEvents = popularEvents.slice(0, 3);
    return [...topPlaces, ...topEvents];
  }, [popularEvents, popularPlaces]);

  const isLoading = eventsQuery.isLoading || placesQuery.isLoading;
  const isError = eventsQuery.isError || placesQuery.isError;

  return {
    featured,
    popularEvents,
    popularPlaces,
    isLoading,
    isError,
  };
};

export default useHomeData;
