import axios from 'axios';
import Cookies from 'js-cookie';

// Lấy URL từ biến môi trường hoặc mặc định localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request interceptor: Tự động đính kèm Token vào mọi yêu cầu
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Response interceptor: Xử lý lỗi 401 (Hết hạn phiên làm việc)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Nếu không phải đang ở trang login thì mới redirect để tránh vòng lặp
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        Cookies.remove('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// 3. Auth API: Quản lý đăng nhập, đăng ký và hồ sơ
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/api/auth/login', credentials),
  
  // Hàm REGISTER mới thêm vào để hỗ trợ tạo tài khoản ngay từ màn hình Login
  register: (userData: any) => 
    api.post('/api/auth/register', userData),
    
  logout: () => api.post('/api/auth/logout'),
  getProfile: () => api.get('/api/users/profile'),
};

// 4. Syllabus API: Quản lý đề cương
export const syllabusAPI = {
  getAll: (status?: string) => 
    api.get('/api/syllabi', { params: status ? { status } : {} }),
  getById: (id: number) => api.get(`/api/syllabi/${id}`),
  getMy: () => api.get('/api/syllabi/my'),
  getPendingReview: () => api.get('/api/syllabi/pending-review'),
  search: (keyword: string) => 
    api.get('/api/syllabi/search', { params: { keyword } }),
  create: (data: any) => api.post('/api/syllabi', data),
  update: (id: number, data: any) => api.put(`/api/syllabi/${id}`, data),
  submit: (id: number) => api.post(`/api/syllabi/${id}/submit`),
  approve: (id: number, comments?: string) => 
    api.post(`/api/syllabi/${id}/approve`, null, { params: { comments } }),
  reject: (id: number, comments: string) => 
    api.post(`/api/syllabi/${id}/reject`, null, { params: { comments } }),
  publish: (id: number) => api.post(`/api/syllabi/${id}/publish`),
};

// 5. User API: Quản lý người dùng cho Admin
export const userAPI = {
  getAll: () => api.get('/api/users'),
  getById: (id: number) => api.get(`/api/users/${id}`),
  create: (data: any) => api.post('/api/users', data),
  update: (id: number, data: any) => api.put(`/api/users/${id}`, data),
  delete: (id: number) => api.delete(`/api/users/${id}`),
  importUsers: (formData: FormData) => api.post('/api/users/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

// 6. Notification API: Thông báo hệ thống
export const notificationAPI = {
  getAll: () => api.get('/api/notifications'),
  getUnread: () => api.get('/api/notifications/unread'),
  markAsRead: (id: number) => api.put(`/api/notifications/${id}/read`),
  getUnreadCount: () => api.get('/api/notifications/unread-count'),
};

export default api;