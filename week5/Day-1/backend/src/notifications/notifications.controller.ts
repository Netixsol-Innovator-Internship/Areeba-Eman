import { Controller, Get, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly svc: NotificationsService) {}

  @Get(':username')
  getUnread(@Param('username') username: string) {
    return this.svc.getUnread(username);
  }
}
