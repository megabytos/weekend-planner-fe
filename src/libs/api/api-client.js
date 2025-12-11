/**
 * Shared Axios instance for backend requests.
 *
 * - Base URL: `NEXT_PUBLIC_API_BASE_URL` env or the default Render backend.
 * - Timeout: 30s.
 * - Interceptors:
 *    - request: pass-through, logs request errors.
 *    - response: logs structured errors and normalizes the thrown Error message
 *      to `response.data.message` when available.
 */
import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'https://weekend-planner-be.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Request failed';
    return Promise.reject(new Error(message));
  },
);

export default apiClient;
