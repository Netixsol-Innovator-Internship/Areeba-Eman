import { type Document, Types } from "mongoose";
export type NotificationDocument = Notification & Document;
export declare enum NotificationType {
    COMMENT = "comment",
    REPLY = "reply",
    LIKE = "like",
    FOLLOW = "follow"
}
export declare class Notification {
    recipient: Types.ObjectId;
    sender: Types.ObjectId;
    type: NotificationType;
    message: string;
    relatedComment: Types.ObjectId;
    isRead: boolean;
}
export declare const NotificationSchema: import("mongoose").Schema<Notification, import("mongoose").Model<Notification, any, any, any, Document<unknown, any, Notification> & Notification & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Notification, Document<unknown, {}, import("mongoose").FlatRecord<Notification>> & import("mongoose").FlatRecord<Notification> & {
    _id: Types.ObjectId;
}>;
