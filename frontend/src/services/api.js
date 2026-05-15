import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim() || '';
const normalizeApiBase = (value) => {
  const trimmedValue = value.trim().replace(/\/+$/, '');

  if (!trimmedValue) {
    return '';
  }

  return trimmedValue.endsWith('/api') ? trimmedValue : `${trimmedValue}/api`;
};

const chooseApiBase = () => {
  if (configuredApiUrl) {
    return normalizeApiBase(configuredApiUrl);
  }

  if (import.meta.env.PROD) {
    return '/api';
  }

  return 'http://localhost:5000/api';
};

const normalizedApiUrl = chooseApiBase();

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
