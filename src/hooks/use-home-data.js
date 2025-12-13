'use client';

import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getPopularEvents, getPopularPlaces } from '@/services/fetch/get-popular';
import { DEFAULT_CITY } from '@/utils/params-builder';

const DEFAULT_LIMIT = 12;

const extractItems = (data) => {
  if (!data) return [];
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data)) return data;
  return [];
};

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
  const cityId = useMemo(() => {
    const id = filter?.city?.id ?? DEFAULT_CITY.city.id;
    return Number.isFinite(Number(id)) ? Number(id) : DEFAULT_CITY.city.id;
  }, [filter]);

  const eventsQuery = useQuery({
    queryKey: ['popular-events', cityId],
    queryFn: () => getPopularEvents(cityId),
    staleTime: 1000 * 60 * 5,
    select: (data) => extractItems(data).slice(0, DEFAULT_LIMIT),
  });

  const placesQuery = useQuery({
    queryKey: ['popular-places', cityId],
    queryFn: () => getPopularPlaces(cityId),
    staleTime: 1000 * 60 * 5,
    select: (data) => extractItems(data).slice(0, DEFAULT_LIMIT),
  });

  const popularEvents = useMemo(
    () => eventsQuery.data || [],
    [eventsQuery.data],
  );
  const popularPlaces = useMemo(
    () => placesQuery.data || [],
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
