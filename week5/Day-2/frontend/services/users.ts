import api from '@/lib/api';

export const getMyProfile = () => api.get('/users/profile');
export const updateProfile = (data: any) => api.put('/users/profile', data);
export const uploadProfilePicture = (file: File) => {
  const form = new FormData();
  form.append('file', file);
  return api.post('/users/profile/picture', form, { headers: { 'Content-Type': 'multipart/form-data' } });
};
// export const getUserByUsername = (username: string) => api.get(`/users/${username}`);
export const getAllUsers = () => api.get('/users');
