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
  try {
    const data = await getCities();
    const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
    

    const city = items.find(item => 
      item.name && item.name.toLowerCase() === name.toLowerCase()
    );
    
    if (city) {
      return city;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to search city by name:', error);
    throw error;
  }
};