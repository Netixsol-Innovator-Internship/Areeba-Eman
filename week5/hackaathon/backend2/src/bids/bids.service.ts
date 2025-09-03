import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bid, BidDocument } from './schemas/bid.schema';
import { Car, CarDocument } from '../cars/schemas/car.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class BidsService {
  constructor(
    @InjectModel(Bid.name) private bidModel: Model<BidDocument>,
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    private users: UsersService,
  ) {}

  async placeBid(userId: string, carId: string, amount: number) {
    const car = await this.carModel.findById(carId);
    if (!car) throw new NotFoundException('Car not found');
    if (String(car.seller) === String(userId)) throw new ForbiddenException('Cannot bid on own car');
    if (car.status !== 'live') throw new BadRequestException('Auction not live');

    const top = await this.bidModel.findOne({ car: car._id }).sort({ amount: -1 });
    const highest = top?.amount ?? 0;
    if (amount <= highest) throw new BadRequestException('Bid must be higher than current top');

    const bid = await this.bidModel.create({ bidder: new Types.ObjectId(userId), car: car._id, amount });
    await this.carModel.findByIdAndUpdate(carId, { $addToSet: { bids: bid._id } });
    const user = await this.users.findById(userId);
    if (user) { user.myBids.push(bid._id as Types.ObjectId); await user.save(); }
    return bid;
  }

  async getBidsForCar(carId: string) {
    return this.bidModel.find({ car: new Types.ObjectId(carId) }).populate('bidder', 'username fullName').sort({ amount: -1 });
  }

  async getTopBid(carId: string) {
    return this.bidModel.findOne({ car: carId }).sort({ amount: -1 });
  }
}
