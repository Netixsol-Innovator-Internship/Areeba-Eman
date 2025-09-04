import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  ACTIVE = 'active',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  @ApiProperty({ type: String, description: 'Product ID' })
  productId: any;

  @Prop({ required: true })
  @ApiProperty({ type: String, description: 'Product name' })
  name: string;

  @Prop({ required: true })
  @ApiProperty({ type: Number, description: 'Unit price of the product' })
  unitPrice: number;

  @Prop({ required: true })
  @ApiProperty({ type: Number, description: 'Quantity ordered' })
  quantity: number;

  @Prop({ required: true })
  @ApiProperty({ type: Number, description: 'Line total = unitPrice * quantity' })
  lineTotal: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: any;

  @Prop({ type: [OrderItemSchema], default: [] })
  items: OrderItem[];

  @Prop({ type: Object, default: {} })
  @ApiProperty({
    type: Object,
    example: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
    },
  })
  addressInfo: any;

  @Prop({ type: Object, default: {} })
  @ApiProperty({
    type: Object,
    example: { method: 'card', transactionId: 'TXN123456' },
  })
  paymentInfo: any;

  @Prop({ default: 0 })
  subtotal: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 15 })
  deliveryCharges: number;

  @Prop({ default: 0 })
  total: number;

  @Prop({ type: String, enum: Object.values(OrderStatus), default: OrderStatus.ACTIVE })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
