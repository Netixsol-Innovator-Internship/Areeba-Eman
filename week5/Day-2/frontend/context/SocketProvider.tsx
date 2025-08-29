'use client';
import { useEffect } from 'react';
import { getSocket } from '@/lib/socket';
import { useStore } from '@/store/useStore';

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const setUnread = useStore(s => s.setUnread);
  useEffect(() => {
    const socket = getSocket();
    const handlers = {
      new_comment: (payload: any) => {
        // could push to local feed via a store
      },
      new_reply: (payload: any) => {},
      comment_liked: (payload: any) => {},
      new_follower: (payload: any) => {},
      unread_count: (n: number) => setUnread(n),
    };
    socket.on('new_comment', handlers.new_comment);
    socket.on('new_reply', handlers.new_reply);
    socket.on('comment_liked', handlers.comment_liked);
    socket.on('new_follower', handlers.new_follower);
    socket.on('unread_count', handlers.unread_count);
    return () => {
      socket.off('new_comment', handlers.new_comment);
      socket.off('new_reply', handlers.new_reply);
      socket.off('comment_liked', handlers.comment_liked);
      socket.off('new_follower', handlers.new_follower);
      socket.off('unread_count', handlers.unread_count);
    };
  }, [setUnread]);
  return <>{children}</>;
}
