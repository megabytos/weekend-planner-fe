import { useMemo } from 'react';

import { searchEventsAndPlaces } from '@/services/fetch/search';
import { useQuery } from '@tanstack/react-query';

const sanitizeParams = (params = {}) => {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  );
};

export const useSearchQuery = (params = {}, options = {}) => {
  const payload = useMemo(() => sanitizeParams(params), [params]);

  console.log('[useSearchQuery] query payload:', payload);

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
