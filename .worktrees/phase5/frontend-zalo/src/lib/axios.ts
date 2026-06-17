import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const zaloId = localStorage.getItem('zalo_id');
  const fullName = localStorage.getItem('full_name');
  const phone = localStorage.getItem('phone');

  if (zaloId) {
    config.headers['x-zalo-id'] = zaloId;
    if (fullName) config.headers['x-full-name'] = encodeURIComponent(fullName);
    if (phone) config.headers['x-phone'] = phone;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
