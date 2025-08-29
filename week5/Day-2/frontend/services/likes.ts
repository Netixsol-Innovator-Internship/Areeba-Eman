import api from '@/lib/api';

export const toggleLike = (commentId: string) =>
  api.post(`/likes/comment/${commentId}`);
export const checkIfLiked = (commentId: string) => api.get(`/likes/comment/${commentId}/check`);
// export const likeComment = (id: string) => api.post(`/likes/comment/${id}`);
// export const unlikeComment = (id: string) => api.delete(`/likes/comment/${id}`);
export const getCommentLikes = (id: string) => api.get(`/likes/comment/${id}`);
export const checkCommentLiked = (id: string) => api.get(`/likes/comment/${id}/check`);
export const getMyLikes = () => api.get('/likes/user/my-likes');
