'use client';

import { useMemo } from 'react';

import { useSearchQuery } from '@/hooks/use-search-query';
import buildSearchParams from '@/utils/params-builder';

const DEFAULT_LIMIT = 12;

const extractItems = (data) =>
  Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];

/**
 * Hook to fetch popular events and places on the home page.
 *
 * @param {Object} filter - Filter object to apply to the search query.
 * @returns {Object} An object containing the popular events, popular places, and loading state.
 *
 * The returned object has the following properties:
 * - featured: An array containing the top 3 popular events and places.
 * - popularEvents: An array containing the popular events.
 * - popularPlaces: An array containing the popular places.
 * - isLoading: A boolean indicating whether the data is loading.
 * - isError: A boolean indicating whether there was an error while fetching the data.
 */
const useHomeData = (filter = {}) => {
  const eventsFilter = useMemo(
    () => ({ ...filter, target: 'events' }),
    [filter],
  );
  const placesFilter = useMemo(
    () => ({ ...filter, target: 'places' }),
    [filter],
  );

  const eventsParams = useMemo(
    () =>
      buildSearchParams({
        page: 1,
        filter: eventsFilter,
        limit: DEFAULT_LIMIT,
      }),
    [eventsFilter],
  );

  const placesParams = useMemo(
    () =>
      buildSearchParams({
        page: 1,
        filter: placesFilter,
        limit: DEFAULT_LIMIT,
      }),
    [placesFilter],
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
