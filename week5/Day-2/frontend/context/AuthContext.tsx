'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
// import {api} from '@/lib/axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

interface User {
  id: string;
  email: string;
  username: string;
  // add other fields from your backend user entity
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Helper to get token
  const getToken = () => localStorage.getItem('token');
  const username = user?.username;

  // ✅ Fetch logged-in user
  const fetchUser = async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ✅ Login
  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { username, password });
      const token = res.data.token;
      localStorage.setItem('token', token);
      await fetchUser();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  // ✅ Register
  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { username, email, password });
      const token = res.data.token;;
      localStorage.setItem('token', token);
      await fetchUser();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
