import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { CreateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>) {}

  async create(dto: CreateNotificationDto) {
  const payload = {
    ...dto,
    sender: new Types.ObjectId(dto.sender),
    receiver: new Types.ObjectId(dto.receiver),
    car: dto.car ? new Types.ObjectId(dto.car) : undefined,
    bid: dto.bid ? new Types.ObjectId(dto.bid) : undefined,
  };

  return this.notificationModel.create(payload);
}

  async forUser(userId: string) {
  return this.notificationModel
    .find({ receiver: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .populate('sender', 'username')  // optional
    .populate('car')                 // optional
    .populate('bid');                // optional
}

  async markRead(id: string) {
    return this.notificationModel.findByIdAndUpdate(id, { read: true }, { new: true });
  }
}
