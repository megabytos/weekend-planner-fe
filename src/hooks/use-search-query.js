import { useMemo } from 'react';

import { searchEventsAndPlaces } from '@/services/fetch/search';
import { useQuery } from '@tanstack/react-query';

const sanitizeParams = (params = {}) => {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  );
};

/**
 * Hook to fetch search results from the server.
 *
 * @param {Object} params - Search filter object.
 * @param {Object} options - Options object.
 * @param {function} options.onSuccess - Callback function to be called when the data is successfully fetched.
 * @param {function} options.onError - Callback function to be called when an error occurs while fetching the data.
 * @returns {Object} An object containing the search results and the fetching state.
 */
export const useSearchQuery = (params = {}, options = {}) => {
  const payload = useMemo(() => sanitizeParams(params), [params]);

  return useQuery({
    queryKey: ['search', payload],
    queryFn: () => searchEventsAndPlaces(payload),
    staleTime: 1000 * 60,
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('[useSearchQuery] error:', error);
      options?.onError?.(error);
    },
    ...options,
  });
};
