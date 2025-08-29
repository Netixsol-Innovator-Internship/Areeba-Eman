import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly auth: AuthService) {}

  getUnread(username: string) {
    const user = this.auth.find(username);
    if (!user) return [];
    const items = [...user.unread];
    user.unread = [];
    return items;
  }
}
