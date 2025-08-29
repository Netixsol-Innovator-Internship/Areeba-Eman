import { Injectable } from '@nestjs/common';
import { Comment } from './comment.interface';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class CommentsService {
  private comments: Comment[] = [];
  private nextId = 1;

  constructor(private readonly auth: AuthService) {}

  getAll() {
    // return without exposing creatorSocketId
    return this.comments.map(({ creatorSocketId, ...rest }) => rest);
  }

  create(user: string, text: string, to: string | null, creatorSocketId: string) {
    const c: Comment = {
      id: this.nextId++,
      user,
      text,
      to: to || null,
      createdAt: Date.now(),
      creatorSocketId,
    };
    this.comments.push(c);

    // unread notifications for other users (excluding author & DM target logic)
    this.auth.users.forEach(u => {
      if (u.username === user) return;
      if (to && u.username !== to) return; // DM: only recipient gets it
      const label = to ? `DM from @${user}: ${text}` : `${user} commented: ${text}`;
      u.unread.push(label);
    });

    const { creatorSocketId: _omit, ...payload } = c;
    return payload;
  }

  delete(id: number, requesterSocketId: string): { ok: boolean } {
    const idx = this.comments.findIndex(c => c.id === id);
    if (idx === -1) return { ok: false };
    const c = this.comments[idx];
    if (c.creatorSocketId !== requesterSocketId) return { ok: false };
    this.comments.splice(idx, 1);
    return { ok: true };
  }

  // Used by REST delete when a username is provided (fallback)
  deleteByUser(id: number, username: string) {
    const idx = this.comments.findIndex(c => c.id === id && c.user === username);
    if (idx === -1) return { ok: false };
    this.comments.splice(idx, 1);
    return { ok: true };
  }
}
