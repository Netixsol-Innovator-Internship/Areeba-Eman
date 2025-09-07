import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { Rating, RatingSchema } from './schemas/rating.schema';
import { ProductsModule } from '../products/products.module';
import { SocketGateway } from '../socket/socket.gateway';
@Module({ imports: [MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }]), ProductsModule], providers: [RatingsService, SocketGateway], controllers: [RatingsController], })
export class RatingsModule {}
