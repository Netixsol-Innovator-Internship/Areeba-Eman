// lib/useSocket.ts
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Comment {
  id: number;
  user: string;
  text: string;
}

export const useSocket = (username: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    const sock = io("http://localhost:4000");
    setSocket(sock);

    sock.on("all_comments", (data: Comment[]) => setComments(data));

    sock.on("new_comment", (comment: Comment) => {
      setComments(prev => [...prev, comment]);
      if (comment.user !== username) {
        setNotification(`${comment.user} posted: ${comment.text}`);
        setTimeout(() => setNotification(null), 3000);
      }
    });

    sock.on("delete_comment", (id: number) => {
      setComments(prev => prev.filter(c => c.id !== id));
    });

    return () => {
      sock.disconnect();
    };
  }, [username]);

  const sendComment = (text: string) => {
    if (socket && text.trim() && username) {
      socket.emit("add_comment", { user: username, text });
    }
  };

  const deleteComment = (id: number) => {
    if (socket) socket.emit("delete_comment", id);
  };

  return { comments, notification, sendComment, deleteComment };
};
