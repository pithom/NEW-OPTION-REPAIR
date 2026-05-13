import axios from 'axios';

const fallbackApiUrl = 'https://new-option-repair-backend.onrender.com';
const rawApiUrl = (import.meta.env.VITE_API_URL || fallbackApiUrl).trim();
const trimmedApiUrl = rawApiUrl?.replace(/\/+$/, '') || '';
const normalizedApiUrl = trimmedApiUrl
  ? trimmedApiUrl.endsWith('/api')
    ? trimmedApiUrl
    : `${trimmedApiUrl}/api`
  : '/api';

const api = axios.create({
  baseURL: normalizedApiUrl,
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthEvent && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    return Promise.reject(error);
  }
);

export default api;
