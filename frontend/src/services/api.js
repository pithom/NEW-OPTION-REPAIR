import axios from 'axios';

const fallbackApiUrl = 'https://new-option-repair-backend.onrender.com';
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim() || '';
const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value);

const chooseApiBase = () => {
  const trimmedConfigured = configuredApiUrl.replace(/\/+$/, '');

  if (!trimmedConfigured) {
    return `${fallbackApiUrl}/api`;
  }

  if (isAbsoluteUrl(trimmedConfigured)) {
    return trimmedConfigured.endsWith('/api') ? trimmedConfigured : `${trimmedConfigured}/api`;
  }

  // In production, a relative API URL on a static site causes requests to hit the frontend service.
  if (import.meta.env.PROD) {
    console.warn(
      `VITE_API_URL="${configuredApiUrl}" is relative in production. Falling back to ${fallbackApiUrl}/api.`
    );
    return `${fallbackApiUrl}/api`;
  }

  return trimmedConfigured.endsWith('/api') ? trimmedConfigured : `${trimmedConfigured}/api`;
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
