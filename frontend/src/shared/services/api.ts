import axios from 'axios';
import { queryClient } from '../lib/queryClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial to send and receive cookies (JWT session)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to format error payloads
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Unpack backend structured error responses
    const apiError = error.response?.data;
    
    // Clear user cache if token is invalid or expired
    if (error.response?.status === 401) {
      queryClient.setQueryData(['currentUser'], null);
    }
    
    const formattedError = {
      message: apiError?.message || error.message || 'Something went wrong',
      errors: apiError?.errors || null,
      status: error.response?.status || 500,
    };
    
    return Promise.reject(formattedError);
  }
);

export default api;
