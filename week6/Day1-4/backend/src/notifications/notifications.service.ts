import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from './schemas/notification.schema';
import { SocketGateway } from '../socket/socket.gateway';
@Injectable()
export class NotificationsService {
  constructor(@InjectModel(Notification.name) private model: Model<Notification>, private socket: SocketGateway) {}
  async notifyUser(userId: string, type: string, payload: any) {
    const n = await this.model.create({ userId: new Types.ObjectId(userId), type, payload });
    this.socket.notifyUser(userId, type, payload);
    return n;
  }
  async notifyAdmins(type: string, payload: any) {
    const n = await this.model.create({ type, payload });
    this.socket.notifyAdmins(type, payload);
    return n;
  }
}
