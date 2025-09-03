import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ enum: ['start','end','win','new'], required: true }) type: string;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) sender: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) receiver: Types.ObjectId;
  @Prop({ default: false }) read: boolean;
  @Prop() comment?: string;
  @Prop({ type: Types.ObjectId, ref: 'Car' }) car?: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Bid' }) bid?: Types.ObjectId;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
