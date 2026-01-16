import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8080'; // Change to your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      // Navigate to login screen
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/api/auth/login', credentials),
  logout: () => api.post('/api/auth/logout'),
};

// Syllabus API
export const syllabusAPI = {
  getAll: (status?: string) => 
    api.get('/api/syllabi', { params: status ? { status } : {} }),
  getById: (id: number) => api.get(`/api/syllabi/${id}`),
  search: (keyword: string) => 
    api.get('/api/syllabi/search', { params: { keyword } }),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/api/users/profile'),
};

export default api;