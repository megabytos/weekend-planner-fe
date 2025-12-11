/**
 * Search API helper
 * - Endpoint: `/search`
 * - `searchEventsAndPlaces(params)`: POST filtered payload (filters out undefined) and returns data.
 */
import apiClient from '@/libs/api/api-client';

const SEARCH_ENDPOINT = '/search';

export const searchEventsAndPlaces = async (params = {}) => {
  const payload = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  );

  const { data } = await apiClient.post(SEARCH_ENDPOINT, payload);
  return data;
};
