import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/constants';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL, // Use the API_URL from constants
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token if refresh token endpoint exists
        // const refreshToken = await AsyncStorage.getItem('refreshToken');
        // const response = await axios.post('http://YOUR_BACKEND_IP:PORT/api/auth/refresh', { refreshToken });
        // await AsyncStorage.setItem('userToken', response.data.token);
        // originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
        // return api(originalRequest);
        
        // For now, just clear token and handle in auth context
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userInfo');
      } catch (refreshError) {
        // Clear all auth data
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userInfo');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;