import api from '@/lib/api';

export const getMyNotifications = () => api.get('/notifications');
export const getUnreadCount = () => api.get('/notifications/unread-count');
export const markNotificationRead = (id: string) => api.put(`/notifications/${id}/read`);
export const markAllRead = () => api.put('/notifications/mark-all-read');
export const deleteNotification = (id: string) => api.delete(`/notifications/${id}`);
