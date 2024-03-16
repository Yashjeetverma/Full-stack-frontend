import axios from 'axios';
import { sessionExpired } from './actions/authActions';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && error.response.data.error === 'TokenExpiredError' && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('userToken');
      sessionExpired();
      alert('Session expired. Please login again.');
    }

    return Promise.reject(error);
  }
);

export default api;
