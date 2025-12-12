/**
 * Popular items API helpers
 * - Events: GET /events/popular/:cityId
 * - Places: GET /places/popular/:cityId
 */
import apiClient from '@/libs/api/api-client';

export const getPopularEvents = async (cityId) => {
  if (cityId == null) throw new Error('cityId is required to fetch events');
  const { data } = await apiClient.get(`/events/popular/${cityId}`);
  return data;
};

export const getPopularPlaces = async (cityId) => {
  if (cityId == null) throw new Error('cityId is required to fetch places');
  const { data } = await apiClient.get(`/places/popular/${cityId}`);
  return data;
};
