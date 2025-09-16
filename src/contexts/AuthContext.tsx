'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  phone: string;
  building: string;
  flat: string;
  role: 'user' | 'admin';
  profilePicture?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string, otp: string) => Promise<{ success: boolean; message: string; user?: User }>;
  register: (phone: string, otp: string, userData: RegisterData) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => Promise<void>;
  sendOTP: (phone: string, purpose: 'login' | 'registration') => Promise<{ success: boolean; message: string; retryAfter?: number }>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  name: string;
  building: string;
  flat: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      // User not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async (phone: string, purpose: 'login' | 'registration') => {
    try {
      const response = await axios.post('/api/auth/send-otp', {
        phone,
        purpose
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send OTP',
        retryAfter: error.response?.data?.retryAfter
      };
    }
  };

  const login = async (phone: string, otp: string) => {
    try {
      const response = await axios.post('/api/auth/verify-otp', {
        phone,
        otp,
        purpose: 'login'
      });

      if (response.data.success) {
        setUser(response.data.user);
        // Store token in localStorage for client-side access
        localStorage.setItem('auth-token', response.data.token);
      }

      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (phone: string, otp: string, userData: RegisterData) => {
    try {
      const response = await axios.post('/api/auth/verify-otp', {
        phone,
        otp,
        purpose: 'registration',
        userData
      });

      if (response.data.success) {
        setUser(response.data.user);
        // Store token in localStorage for client-side access
        localStorage.setItem('auth-token', response.data.token);
      }

      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      setUser(null);
      localStorage.removeItem('auth-token');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      setUser(null);
    }
  };

  // Set up axios interceptor to include auth token
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Response interceptor to handle token expiration
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setUser(null);
          localStorage.removeItem('auth-token');
          delete axios.defaults.headers.common['Authorization'];
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    sendOTP,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}