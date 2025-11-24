import apiClient from '@/libs/api/api-client';

const CITIES_ENDPOINT = '/geo/cities';

export const getCities = async () => {
  const { data } = await apiClient.get(CITIES_ENDPOINT);
  return data;
};

export const getCityById = async (id) => {
  const { data } = await apiClient.get(`${CITIES_ENDPOINT}/${id}`);
  return data;
};

export const getCityByName = async (name) => {
  const { data } = await apiClient.get(`${CITIES_ENDPOINT}/name/${name}`);
  return data;
};
