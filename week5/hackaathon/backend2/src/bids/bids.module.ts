import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema } from './schemas/bid.schema';
import { Car, CarSchema } from '../cars/schemas/car.schema';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Bid.name, schema: BidSchema }, { name: Car.name, schema: CarSchema }]),
  ],
  providers: [BidsService],
  controllers: [BidsController],
  exports: [BidsService],
})
export class BidsModule {}
