// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { Rating } from './schemas/rating.schema';
// import { ProductsService } from '../products/products.service';
// @Injectable()
// export class RatingsService {
//   constructor(@InjectModel(Rating.name) private model: Model<Rating>, private products: ProductsService) {}
//   async add(productId: string, userId: string, stars: number, comment: string) {
//     await this.model.create({ productId: new Types.ObjectId(productId), userId: new Types.ObjectId(userId), stars, comment });
//     const agg = await this.model.aggregate([{ $match: { productId: new Types.ObjectId(productId) } }, { $group: { _id: '$productId', avg: { $avg: '$stars' } } }]);
//     const avg = agg[0]?.avg || 0;
//     await this.products.setAverageRating(productId, Number(avg.toFixed(2)));
//     return { message: 'Rating added', average: Number(avg.toFixed(2)) };
//   }
//   async average(productId: string) {
//     const agg = await this.model.aggregate([{ $match: { productId: new Types.ObjectId(productId) } }, { $group: { _id: '$productId', avg: { $avg: '$stars' } } }]);
//     return { productId, average: agg[0]?.avg || 0 };
//   }
// }
// ratings.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rating } from './schemas/rating.schema';
import { ProductsService } from '../products/products.service';
import { SocketGateway } from '../socket/socket.gateway'; // <-- import

@Injectable()
export class RatingsService {
  constructor(
    @InjectModel(Rating.name) private model: Model<Rating>,
    private products: ProductsService,
    private socket: SocketGateway, // <-- injected
  ) {}

  async add(productId: string, userId: string, stars: number, comment: string) {
    const created = await this.model.create({
      productId: new Types.ObjectId(productId),
      userId: new Types.ObjectId(userId),
      stars,
      comment,
    });

    const agg = await this.model.aggregate([
      { $match: { productId: new Types.ObjectId(productId) } },
      { $group: { _id: '$productId', avg: { $avg: '$stars' } } },
    ]);
    const avg = agg[0]?.avg || 0;
    await this.products.setAverageRating(productId, Number(avg.toFixed(2)));

    // notify via socket - useful for product pages to refresh in real-time
    try {
      this.socket.notifyAdmins('ratingAdded', { productId, rating: created });
      // optionally: notify product watchers / owner
      this.socket.server?.to(`product:${productId}`).emit('ratingAdded', { productId, rating: created });
    } catch (e) {
      // ignore
    }

    return { message: 'Rating added', average: Number(avg.toFixed(2)) };
  }

  async average(productId: string) {
    const agg = await this.model.aggregate([
      { $match: { productId: new Types.ObjectId(productId) } },
      { $group: { _id: '$productId', avg: { $avg: '$stars' } } },
    ]);
    return { productId, average: agg[0]?.avg || 0 };
  }

  // NEW - list ratings for a product, populated with user fields
  async list(productId: string) {
    return this.model
      .find({ productId: new Types.ObjectId(productId) })
      .sort({ createdAt: -1 })
      .populate('userId', 'fullName email');
  }


    // ratings.service.ts
    async findAll() {
      return this.model.find().populate('userId', 'fullName').lean();
    }
}
