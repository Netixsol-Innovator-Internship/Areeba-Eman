import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) price: number;
  @Prop({ type: String, enum: ['jeans', 'shirts', 'tshirts', 'hoodies', 'shorts'] }) types: string;
  @Prop({ default: 0 }) stockQuantity: number;
  @Prop({ default: 0 }) sales: number; // total sales count
  @Prop({ default: false }) sale: boolean;
  @Prop({ default: 0 }) discount: number;
  @Prop({ type: Date }) saleEnd?: Date;
  @Prop({ type: String, enum: ['male', 'female'], required: false }) category?: string;
  @Prop({ type: String, enum: ['casual', 'formal', 'party', 'gym'], required: false }) style?: string;
  @Prop({
    type: [String],
    enum: [
      'xsmall', 'small', 'medium', 'large', 'x large', 'xxlarge', '2x large', '3x large',
    ],
    default: [],
  })
  size: string[];

  @Prop({ type: Map, of: [String], default: {} }) imagesByColor: Map<string, string[]>;
  @Prop({ default: 0 }) averageRating: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Virtual for time left
ProductSchema.virtual('timeLeft').get(function (this: any) {
  return this.saleEnd
    ? Math.max(0, new Date(this.saleEnd).getTime() - Date.now())
    : null;
});

// Transform JSON to include salePrice
ProductSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    return {
      ...ret,
      salePrice:
        ret.sale && ret.discount > 0
          ? parseFloat((ret.price * (1 - ret.discount / 100)).toFixed(2))
          : ret.price,
    };
  },
});
