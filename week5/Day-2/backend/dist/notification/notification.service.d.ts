import { Model } from "mongoose";
import { NotificationDocument, NotificationType } from "../schemas/notification.schema";
export declare class NotificationService {
    private readonly notificationModel;
    constructor(notificationModel: Model<NotificationDocument>);
    createNotification(recipientId: string, senderId: string, type: NotificationType, message: string, relatedCommentId?: string): Promise<NotificationDocument>;
    getUserNotifications(userId: string): Promise<NotificationDocument[]>;
    markAsRead(notificationId: string): Promise<NotificationDocument>;
    markAllAsRead(userId: string): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
    deleteNotification(notificationId: string): Promise<void>;
}
