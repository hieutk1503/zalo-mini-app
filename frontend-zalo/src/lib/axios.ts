import axios from 'axios';
import { API_BASE_URL } from './config';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('zalo_access_token');
  const zaloId = localStorage.getItem('zalo_id');
  const fullName = localStorage.getItem('full_name');
  const phone = localStorage.getItem('phone');

  if (accessToken) {
    config.headers['x-zalo-access-token'] = accessToken;
  } else if (zaloId) {
    config.headers['x-zalo-id'] = zaloId;
    if (fullName) config.headers['x-full-name'] = encodeURIComponent(fullName);
    if (phone) config.headers['x-phone'] = phone;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
