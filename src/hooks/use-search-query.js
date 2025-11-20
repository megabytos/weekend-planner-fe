import { useMemo } from 'react';

import { searchEventsAndPlaces } from '@/services/fetch/search';
import { useQuery } from '@tanstack/react-query';

const DEFAULT_SEARCH_PARAMS = {
  kind: 'both',
  page: 1,
  pageSize: 20,
  when: 'this_weekend',
  lat: 51.5072,
  lon: 0.1276,
};

const sanitizeParams = (params = {}) => {
  const merged = { ...DEFAULT_SEARCH_PARAMS, ...params };
  return Object.fromEntries(
    Object.entries(merged).filter(([, value]) => value !== undefined),
  );
};

export const useSearchQuery = (params = {}, options = {}) => {
  const payload = useMemo(() => sanitizeParams(params), [params]);

  return useQuery({
    queryKey: ['search', payload],
    queryFn: () => searchEventsAndPlaces(payload),
    staleTime: 1000 * 60,
    ...options,
  });
};
