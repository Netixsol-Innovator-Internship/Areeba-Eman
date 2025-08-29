import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type NotificationDocument = Notification & Document

export enum NotificationType {
  COMMENT = "comment",
  REPLY = "reply",
  LIKE = "like",
  FOLLOW = "follow",
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  recipient: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  sender: Types.ObjectId

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType

  @Prop({ required: true })
  message: string

  @Prop({ type: Types.ObjectId, ref: "Comment" })
  relatedComment: Types.ObjectId

  @Prop({ default: false })
  isRead: boolean
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)
