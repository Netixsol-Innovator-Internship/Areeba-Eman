import api from '@/lib/api';

export const register = (data: { username: string; email: string; password: string }) =>
  api.post('/auth/register', data);

export const loginApi = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

export const logoutApi = () => api.post('/auth/logout');

export const getProfile = () => api.get('/users/profile');
