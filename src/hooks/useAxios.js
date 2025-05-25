import axios from 'axios';
import { getAuthToken } from '../utils/storage';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://your-api-url',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error setting auth token:', error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

export default instance;
