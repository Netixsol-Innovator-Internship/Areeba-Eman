import { Controller, Get, UseGuards, Post, Body, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateNotificationDto } from './dto/notification.dto';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notifs: NotificationsService) {}

  @Get()
  list(@GetUser('sub') userId: string) {
    return this.notifs.forUser(userId);
  }

  @Post()
  create(@Body() body: CreateNotificationDto) {
    return this.notifs.create(body);
  }

  @Post(':id/read')
  markRead(@Param('id') id: string) {
    return this.notifs.markRead(id);
  }
}
