import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Car, CarDocument } from './schemas/car.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>, private users: UsersService) {}

  async create(userId: string, data: any, files?: Express.Multer.File[]) {
  const photoPaths = files?.map(file => `/uploads/cars/${file.filename}`) || [];
  const car = new this.carModel({
    ...data,
    photos: photoPaths,
    seller: new Types.ObjectId(userId),
  });
  const saved = await car.save();

  // push to user's myCars
  await this.users.findById(userId).then(u => {
    if (u) {
      u.myCars.push(saved._id as Types.ObjectId);
      u.save();
    }
  });

  return saved;
}

  async findAll(query: any = {}) {
const filter: any = {};

  if (query.year) filter.year = Number(query.year);
  if (query.model) filter.model = query.model;
  if (query.company) filter.make = query.company; // your DTO uses 'make'
  if (query.price) filter.maxBid = { $lte: Number(query.price) };
  if (query.status) filter.status = query.status; // add status filter

  return this.carModel.find(filter).populate('seller', 'username fullName').exec();
  }

  async findById(id: string) {
    const car = await this.carModel.findById(id).populate('seller', 'username fullName').exec();
    if (!car) throw new NotFoundException('Car not found');
    return car;
  }

  async update(id: string, data: any) {
    const car = await this.carModel.findByIdAndUpdate(id, data, { new: true });
    if (!car) throw new NotFoundException('Car not found');
    return car;
  }

  async remove(id: string) {
    return this.carModel.findByIdAndDelete(id);
  }
}
