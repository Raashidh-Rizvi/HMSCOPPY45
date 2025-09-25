import axios from 'axios';
import { AuthUser, User } from '@/types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 409 || error.response?.data?.message?.includes('already in use')) {
      // Handle duplicate email errors
      throw new Error('Email address is already in use');
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth service
export const authService = {
  login: async (email: string, password: string): Promise<AuthUser> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      const authUser: AuthUser = {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email,
        token: token
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(authUser));
      return authUser;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: (): AuthUser | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};