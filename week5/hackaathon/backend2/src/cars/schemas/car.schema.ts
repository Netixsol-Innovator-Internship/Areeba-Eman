import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CarDocument = Car & Document;

@Schema({ timestamps: true })
export class Car {
  @Prop()sellerType: string;
  @Prop() sellerFirstName?: string;
  @Prop() sellerLastName?: string;
  @Prop() sellerEmail?: string;
  @Prop() sellerPhone?: string;

  @Prop({ required: true }) vin: string;
  @Prop({ required: true }) year: number;
  @Prop({ required: true }) make: string;
  @Prop({ required: true }) model: string;
  @Prop() mileage?: number;
  @Prop() engineSize?: string;
  @Prop({ required: true }) paint: string;
  @Prop({ default: false }) hasGccSpecs: boolean;
  @Prop() noteworthyOptions?: string;
  @Prop({ default: false }) accidentHistory: boolean;
  @Prop({ default: false }) fullServiceHistory: boolean;
  @Prop({ enum: ['stock', 'modified'], default: 'stock' }) modification: string;
  @Prop({ required: true }) maxBid: number;
  @Prop({ type: [String], default: [] }) photos: string[];

  @Prop({ default: 'upcoming' }) status: string;
  @Prop() startTime?: Date;
  @Prop() endTime?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  seller: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Bid' }], default: [] })
  bids: Types.ObjectId[];
}

export const CarSchema = SchemaFactory.createForClass(Car);
