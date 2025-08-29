'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { followUser, unfollowUser, getFollowStats } from '@/services/followers';
import { getMyProfile } from '@/services/users';

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [user, setUser] = useState<any | null>(null);
  const [stats, setStats] = useState<any>({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const load = async () => {
    const res = await getMyProfile();
    setUser(res.data.user);
    const s = await getFollowStats(res.data._id);
    setStats(s.data);
  };

  useEffect(() => { load(); }, [username]);

  const toggleFollow = async () => {
    if (!user) return;
    if (isFollowing) {
      await unfollowUser(user._id);
      setIsFollowing(false);
      setStats((s:any)=> ({...s, followers: Math.max(0, (s.followers||1)-1)}));
    } else {
      await followUser(user._id);
      setIsFollowing(true);
      setStats((s:any)=> ({...s, followers: (s.followers||0)+1}));
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <Card className="p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-brand-500" />
        <div className="flex-1">
          <h2 className="text-xl font-semibold">@{user.username}</h2>
          <p className="text-sm text-gray-500">{stats.followers} followers · {stats.following} following</p>
        </div>
        <Button onClick={toggleFollow}>{isFollowing ? 'Unfollow' : 'Follow'}</Button>
      </Card>
    </div>
  );
}
