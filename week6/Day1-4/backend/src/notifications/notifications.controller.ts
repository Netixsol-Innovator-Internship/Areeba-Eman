import { Controller, Get, Patch, Param, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  /** Get all notifications for the logged-in user */
  @Get('me')
  async myNotifications(@Req() req: any) {
    return this.notifications.getUserNotifications(req.user.sub);
  }

  /** Mark a notification as read */
  @Patch(':id/read')
  async markRead(@Param('id') id: string) {
    return this.notifications.markAsRead(id);
  }

  /** Admin-only: get all notifications */
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get()
  async allNotifications() {
    return this.notifications.getAllNotifications();
  }

  /** Admin-only: create a notification manually for a user */
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post('user/:userId')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type: { type: 'string', example: 'orderUpdate' },
        payload: { type: 'object', example: { orderId: '12345', status: 'shipped' } },
      },
      required: ['type', 'payload'],
    },
  })
  async createForUser(
    @Param('userId') userId: string,
    @Body() body: { type: string; payload: any }
  ) {
    return this.notifications.notifyUser(userId, body.type, body.payload);
  }
}
