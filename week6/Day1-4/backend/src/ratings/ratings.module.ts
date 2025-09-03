import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { Rating, RatingSchema } from './schemas/rating.schema';
import { ProductsModule } from '../products/products.module';
@Module({ imports: [MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }]), ProductsModule], providers: [RatingsService], controllers: [RatingsController], })
export class RatingsModule {}
