import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
export enum OrderStatus { ACTIVE='active', DELIVERED='delivered', COMPLETED='completed', CANCELED='canceled' }
@Schema({ _id: false })
class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true }) productId: any;
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) unitPrice: number;
  @Prop({ required: true }) quantity: number;
  @Prop({ required: true }) lineTotal: number;
}
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) userId: any;
  @Prop({ type: [OrderItemSchema], default: [] }) items: OrderItem[];
  @Prop({ type: Object, default: {} }) addressInfo: any;
  @Prop({ type: Object, default: {} }) paymentInfo: any;
  @Prop({ default: 0 }) subtotal: number;
  @Prop({ default: 0 }) discount: number;
  @Prop({ default: 15 }) deliveryCharges: number;
  @Prop({ default: 0 }) total: number;
  @Prop({ type: String, enum: Object.values(OrderStatus), default: OrderStatus.ACTIVE }) status: OrderStatus;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
