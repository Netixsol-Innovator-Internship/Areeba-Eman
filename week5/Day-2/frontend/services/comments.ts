import api from '@/lib/api';

export const createComment = (data: { content: string; parentId?: string }) => api.post('/comments', data);
export const getAllComments = () => api.get('/comments');
export const getCommentById = (id: string) => api.get(`/comments/${id}`);
export const getCommentReplies = (id: string) => api.get(`/comments/${id}/replies`);
export const updateComment = (id: string, content: string) => api.put(`/comments/${id}`, { content });
export const deleteComment = (id: string) => api.delete(`/comments/${id}`);
// ✅ New: fetch all comments with their nested replies
export const getCommentsWithReplies = async (postId: string) => {
  const res = await api.get(`/comments?postId=${postId}&includeReplies=true`);
  return res.data;}

