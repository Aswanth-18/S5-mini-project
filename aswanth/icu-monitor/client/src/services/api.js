import axios from 'axios';

const getStoredValue = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL + '/api' });

api.interceptors.request.use((config) => {
  const token = getStoredValue('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('auth_snapshot');
      } catch {}

      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    if (!err.response) {
      console.warn('Network error or backend unavailable:', err.message);
      window.dispatchEvent(new CustomEvent('app:network-error', { detail: err.message }));
    }

    return Promise.reject(err);
  }
);

export default api;