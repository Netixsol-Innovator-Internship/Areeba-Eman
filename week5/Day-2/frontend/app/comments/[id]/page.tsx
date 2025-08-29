'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCommentById, getCommentReplies } from '@/services/comments';
import CommentCard from '@/components/comments/CommentCard';
import Composer from '@/components/comments/Composer';

export default function ThreadPage() {
  const params = useParams<{ id: string }>();
  const [comment, setComment] = useState<any | null>(null);
  const [replies, setReplies] = useState<any[]>([]);

  const load = async () => {
    const c = await getCommentById(params.id);
    setComment(c.data);

    const r = await getCommentReplies(params.id);
    const repliesArray = Array.isArray(r.data) ? r.data : r.data?.replies || [];
    setReplies(repliesArray);
  };

  useEffect(() => { load(); }, [params.id]);

  if (!comment) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <CommentCard comment={comment} />
      <h3 className="font-semibold">Replies</h3>
      <Composer parentId={comment._id} onCreated={(reply)=> setReplies([reply, ...replies])} />
      <div className="space-y-3">
        {Array.isArray(replies) ? replies.map((r)=> <CommentCard key={r._id} comment={r} />) : null}
      </div>
    </div>
  );
}

// 'use client';
// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import { getCommentById, getCommentReplies } from '@/services/comments';
// import CommentCard from '@/components/comments/CommentCard';
// import Composer from '@/components/comments/Composer';

// export default function ThreadPage() {
//   const params = useParams<{ id: string }>();
//   const [comment, setComment] = useState<any | null>(null);
//   const [replies, setReplies] = useState<any[]>([]);

//   const load = async () => {
//     const c = await getCommentById(params.id);
//     setComment(c.data);
//     const r = await getCommentReplies(params.id);
//     const repliesArray = Array.isArray(r.data) ? r.data : r.data?.replies || [];
//     setReplies(repliesArray); 
//   };

//   useEffect(() => { load(); }, [params.id]);

//   if (!comment) return <p>Loading...</p>;

//   return (
//     <div className="space-y-4">
//       <CommentCard comment={comment} />
//       <h3 className="font-semibold">Replies</h3>
//       <Composer parentId={comment._id} onCreated={(reply)=> setReplies([reply, ...replies])} />
//       <div className="space-y-3">
//         {replies.map((r)=> <CommentCard key={r._id} comment={r} />)}
//       </div>
//     </div>
//   );
// }
