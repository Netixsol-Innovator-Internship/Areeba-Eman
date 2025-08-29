'use client';
import { useEffect, useState } from 'react';
import { getAllComments } from '@/services/comments';
import CommentCard from '@/components/comments/CommentCard';
import Composer from '@/components/comments/Composer';
import Card from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const [comments, setComments] = useState<any[]>([]);

  const { user } = useAuth();
  console.log('welcome:', user);

  const load = async () => {
    const res = await getAllComments();
    // setComments(res.data || []);
    const commentsArray = Array.isArray(res.data) ? res.data : res.data?.comments || [];
    setComments(commentsArray);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <Card className="gradient-card text-white p-6">
        <h1 className="text-2xl font-bold">Welcome {user?.user?.username|| 'Guest'} 👋</h1>
        <p>Share a thought and see real-time updates with Socket.IO.</p>
      </Card>

      <Composer onCreated={(c)=> setComments([c, ...comments])} />

      <div className="space-y-3">
        {comments.map((c) => (
          <CommentCard key={c._id} comment={c} onReply={(pc)=>{}} />
        ))}
      </div>
    </div>
  );
}
