import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
@Schema({ timestamps: true })
export class Rating {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true }) productId: any;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) userId: any;
  @Prop({ min: 1, max: 5, required: true }) stars: number;
  @Prop({ default: '' }) comment: string;
}
export const RatingSchema = SchemaFactory.createForClass(Rating);
