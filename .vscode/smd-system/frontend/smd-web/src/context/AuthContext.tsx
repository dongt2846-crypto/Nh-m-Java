import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '../services/api';

// Định nghĩa các Role có trong hệ thống
export type Role = 'SYSTEM_ADMIN' | 'HOD' | 'LECTURER' | 'STUDENT' | 'ACADEMIC_AFFAIRS' | 'PRINCIPAL' | string;

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles?: Role[];
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<User>;
  registerUser: (data: any) => Promise<void>; // Hàm mới được thêm vào
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
  hasRole: (r: Role) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await authAPI.getProfile();
      setUser(res.data);
    } catch (e) {
      setUser(null);
      Cookies.remove('token'); // Xóa token nếu profile không hợp lệ
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // Xử lý đăng nhập - Bypass authentication và vào luôn giao diện người dùng
  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      // Bypass authentication - set mock admin user và vào luôn /admin/users
      const mockUser = {
        id: 1,
        username: 'admin',
        email: 'admin@smd.com',
        fullName: 'Admin',
        roles: ['SYSTEM_ADMIN']
      };
      setUser(mockUser);
      setLoading(false);
      return mockUser;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Hàm đăng ký mới cho yêu cầu của bạn
  const registerUser = async (data: any) => {
    setLoading(true);
    try {
      // Giả sử authAPI đã có phương thức register trong services/api.ts
      await authAPI.register(data); 
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      // Bỏ qua lỗi logout phía server
    }
    Cookies.remove('token');
    setUser(null);
  };

  const refreshUser = async () => {
    setLoading(true);
    await fetchProfile();
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedUser });
    }
  };

  const hasRole = (r: Role) => {
    if (!user?.roles) return false;
    // Kiểm tra nếu roles là mảng đối tượng (như trong users.tsx) hoặc mảng chuỗi
    return user.roles.some((role: any) =>
      typeof role === 'string' ? role === r : role.name === r
    );
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, registerUser, logout, refreshUser, updateUser, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};