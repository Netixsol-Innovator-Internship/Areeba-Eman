import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import  { Model, Types } from "mongoose"
import { ConfigService } from "@nestjs/config"
import {Notification, NotificationDocument, NotificationType } from "../schemas/notification.schema"
import { InjectModel } from "@nestjs/mongoose"


@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}
  async createNotification(
    recipientId: string,
    senderId: string,
    type: NotificationType,
    message: string,
    relatedCommentId?: string,
  ): Promise<NotificationDocument> {
    const notification = new this.notificationModel({
      recipient: recipientId,
      sender: senderId,
      type,
      message,
      relatedComment: relatedCommentId,
    })

    return notification.save()
  }

  async getUserNotifications(userId: string): Promise<NotificationDocument[]> {
    return this.notificationModel
      .find({ recipient: userId })
      .populate("sender", "username profilePicture")
      .populate("relatedComment", "content")
      .sort({ createdAt: -1 })
  }

  async markAsRead(notificationId: string): Promise<NotificationDocument> {
    if (!Types.ObjectId.isValid(notificationId)) {
      throw new BadRequestException("Invalid notification ID");
    }

    const notification = await this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      throw new NotFoundException("Notification not found");
    }

    return notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel.updateMany({ recipient: userId, isRead: false }, { isRead: true })
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      recipient: userId,
      isRead: false,
    })
  }

  async deleteNotification(notificationId: string): Promise<void> {
    if (!Types.ObjectId.isValid(notificationId)) {
      throw new BadRequestException("Invalid notification ID");
    }

    const result = await this.notificationModel.findByIdAndDelete(notificationId);
    if (!result) {
      throw new NotFoundException("Notification not found");
    }
  }
}
