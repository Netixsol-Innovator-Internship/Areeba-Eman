'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toggleLike, checkIfLiked } from '@/services/likes';

export default function CommentCard({ comment, onReply } : { comment: any, onReply?: (c:any)=>void }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState<number>(comment.likesCount ?? 0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLikedStatus = async () => {
      try {
        const res = await checkIfLiked(comment._id);
        setLiked(res.data.isLiked);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLikedStatus();
  }, [comment._id]);

  const handleToggleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await toggleLike(comment._id);
      const likedNow = res.data.liked;
      setLiked(likedNow);
      setLikes((prev) => likedNow ? prev + 1 : Math.max(prev - 1, 0));
    } catch (e) {
      console.error('Failed to toggle like', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="space-y-2">
      <div className="flex items-center justify-between">
        <Link href={`/profile/${comment.author?.username || 'user'}`} className="font-semibold hover:underline">
          {comment.author?.username || 'Anonymous'}
        </Link>
        <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
      </div>
      <p className="whitespace-pre-wrap">{comment.content}</p>
      <div className="flex items-center gap-3">
        <Button className="px-3 py-1 text-sm" onClick={handleToggleLike} disabled={isLoading}>
          {liked ? '💖' : '🤍'} {likes}
        </Button>
        {onReply && <Button className="px-3 py-1 text-sm" onClick={() => onReply(comment)}>Reply</Button>}
         <Link className="text-sm underline" href={`/comments/${comment._id}`}>Open Thread</Link>
      </div>
    </Card>
  );
}

// 'use client';
// import Card from '@/components/ui/Card';
// import Button from '@/components/ui/Button';
// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import { toggleLike, checkIfLiked } from '@/services/likes';

// export default function CommentCard({ comment, onReply } : { comment: any, onReply?: (c:any)=>void }) {
//   const [liked, setLiked] = useState(false);
//   const [likes, setLikes] = useState(comment.likesCount ?? 0);
//   const [isLoading, setIsLoading] = useState(false);

//   // ✅ On mount, check if the current user liked this comment
//   useEffect(() => {
//     const fetchLikedStatus = async () => {
//       try {
//         const res = await checkIfLiked(comment._id);
//         setLiked(res.data.isLiked);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchLikedStatus();
//   }, [comment._id]);

//   const handleToggleLike = async () => {
//     if (isLoading) return;
//     setIsLoading(true);
//     try {
//       const res = await toggleLike(comment._id);
//       const likedNow = res.data.liked; // backend returns { liked: boolean }
//       setLiked(likedNow);
//       setLikes((prev) => likedNow ? prev + 1 : Math.max(prev - 1, 0));
//     } catch (e) {
//       console.error('Failed to toggle like', e);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Card className="space-y-2">
//       <div className="flex items-center justify-between">
//         <Link href={`/profile/${comment.author?.username || 'user'}`} className="font-semibold hover:underline">
//           {comment.author?.username || 'Anonymous'}
//         </Link>
//         <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
//       </div>
//       <p className="whitespace-pre-wrap">{comment.content}</p>
//       <div className="flex items-center gap-3">
//         <Button className="px-3 py-1 text-sm" onClick={handleToggleLike} disabled={isLoading}>
//           {liked ? '💖' : '🤍'} {likes}
//         </Button>
//         {onReply && <Button className="px-3 py-1 text-sm" onClick={() => onReply(comment)}>Reply</Button>}
//         <Link className="text-sm underline" href={`/comments/${comment._id}`}>Open Thread</Link>
//       </div>
//     </Card>
//   );
// }
