import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rating } from './schemas/rating.schema';
import { ProductsService } from '../products/products.service';
@Injectable()
export class RatingsService {
  constructor(@InjectModel(Rating.name) private model: Model<Rating>, private products: ProductsService) {}
  async add(productId: string, userId: string, stars: number, comment: string) {
    await this.model.create({ productId: new Types.ObjectId(productId), userId: new Types.ObjectId(userId), stars, comment });
    const agg = await this.model.aggregate([{ $match: { productId: new Types.ObjectId(productId) } }, { $group: { _id: '$productId', avg: { $avg: '$stars' } } }]);
    const avg = agg[0]?.avg || 0;
    await this.products.setAverageRating(productId, Number(avg.toFixed(2)));
    return { message: 'Rating added', average: Number(avg.toFixed(2)) };
  }
  async average(productId: string) {
    const agg = await this.model.aggregate([{ $match: { productId: new Types.ObjectId(productId) } }, { $group: { _id: '$productId', avg: { $avg: '$stars' } } }]);
    return { productId, average: agg[0]?.avg || 0 };
  }
}
