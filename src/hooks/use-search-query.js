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
  const {
    onSuccess: userOnSuccess,
    onError: userOnError,
    ...restOptions
  } = options || {};

  return useQuery({
    queryKey: ['search', payload],
    // Protect against accidentally receiving a full Axios response instead of plain data
    queryFn: async () => {
      const resp = await searchEventsAndPlaces(payload);
      if (
        resp &&
        typeof resp === 'object' &&
        'data' in resp &&
        !('items' in resp)
      ) {
        return resp.data;
      }
      return resp;
    },
    staleTime: 1000 * 60,
    onSuccess: (data) => {
      userOnSuccess?.(data);
    },
    onError: (error) => {
      userOnError?.(error);
    },
    ...restOptions,
  });
};
