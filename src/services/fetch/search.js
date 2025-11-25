import apiClient from '@/libs/api/api-client';

const SEARCH_ENDPOINT = '/search';

export const searchEventsAndPlaces = async (params = {}) => {
  const payload = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  );

  console.log('[searchEventsAndPlaces] request payload:', payload);

  const { data } = await apiClient.post(SEARCH_ENDPOINT, payload);
  console.log('[searchEventsAndPlaces] response data:', data);
  return data;
};
