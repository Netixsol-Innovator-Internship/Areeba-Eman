import api from '@/lib/api';

export const followUser = (userId: string) => api.post(`/followers/follow/${userId}`);
export const unfollowUser = (userId: string) => api.delete(`/followers/unfollow/${userId}`);
export const getFollowers = (userId: string) => api.get(`/followers/${userId}/followers`);
export const getFollowing = (userId: string) => api.get(`/followers/${userId}/following`);
export const checkFollowing = (userId: string) => api.get(`/followers/check/${userId}`);
export const getFollowStats = (userId: string) => api.get(`/followers/${userId}/stats`);
export const getMyFollowers = () => api.get('/followers/my-followers');
export const getMyFollowing = () => api.get('/followers/my-following');
