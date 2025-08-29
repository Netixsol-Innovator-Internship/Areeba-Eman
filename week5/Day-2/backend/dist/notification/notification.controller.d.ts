import { NotificationService } from "./notification.service";
import { Request } from "express";
export declare class NotificationController {
    private notificationService;
    constructor(notificationService: NotificationService);
    getMyNotifications(req: Request): Promise<{
        message: string;
        notifications: import("../schemas/notification.schema").NotificationDocument[];
    }>;
    getUnreadCount(req: Request): Promise<{
        message: string;
        count: number;
    }>;
    markAsRead(id: string): Promise<{
        message: string;
        notification: import("../schemas/notification.schema").NotificationDocument;
    }>;
    markAllAsRead(req: Request): Promise<{
        message: string;
    }>;
    deleteNotification(id: string): Promise<{
        message: string;
    }>;
}
