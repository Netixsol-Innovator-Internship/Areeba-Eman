import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from './schemas/notification.schema';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private model: Model<Notification>,
    private socket: SocketGateway
  ) {}

  // Notify a specific user
  async notifyUser(userId: string, type: string, payload: any) {
    const n = await this.model.create({ userId: new Types.ObjectId(userId), type, payload });
    this.socket.notifyUser(userId, type, payload);
    return n;
  }

  // Notify all admins
  async notifyAdmins(type: string, payload: any) {
    const n = await this.model.create({ type, payload });
    this.socket.notifyAdmins(type, payload);
    return n;
  }

  // Get notifications for a specific user
  async getUserNotifications(userId: string) {
    return this.model.find({ userId }).sort({ createdAt: -1 });
  }

  // Mark a notification as read
  async markAsRead(id: string) {
    return this.model.findByIdAndUpdate(id, { read: true }, { new: true });
  }

  // Admin-only: get all notifications
  async getAllNotifications() {
    return this.model.find().sort({ createdAt: -1 });
  }
}
