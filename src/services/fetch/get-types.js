/**
 * Taxonomy API helpers
 * - Endpoint base: `/taxonomy`
 * - Functions:
 *    - `getEventsCategories()`: fetch categories with type=EVENT.
 *    - `getPlacesCategories()`: fetch categories with type=PLACE.
 */
import apiClient from '@/libs/api/api-client';

const TAXONOMY_ENDPOINT = '/taxonomy';

export const getEventsCategories = async () => {
  const { data } = await apiClient.get(`${TAXONOMY_ENDPOINT}/?type=EVENT`);
  return data;
};

export const getPlacesCategories = async () => {
  const { data } = await apiClient.get(`${TAXONOMY_ENDPOINT}/?type=PLACE`);
  return data;
};
