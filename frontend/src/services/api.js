import axios from 'axios';
import { clearAuthToken, readAuthToken } from './authToken.js';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim() || '';
const hostedFallbackApiUrl = 'https://newoption-repair-backend.onrender.com';
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

  if (typeof window !== 'undefined' && window.location.hostname.endsWith('.onrender.com')) {
    return normalizeApiBase(hostedFallbackApiUrl);
  }

  return '/api';
};

const normalizedApiUrl = chooseApiBase();

const api = axios.create({
  baseURL: normalizedApiUrl,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = readAuthToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthEvent && typeof window !== 'undefined') {
      clearAuthToken();
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    return Promise.reject(error);
  }
);

export default api;
