import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: Partial<User>) {
    const created = new this.userModel(data);
    return created.save();
  }

  findByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  findById(id: string) {
    return this.userModel .findById(id)
    .populate({
      path: 'myBids',
      populate: { path: 'car' } // assumes Bid schema has a `car` field referencing Car
    })
    .populate('myCars')
    .populate('wishlist');
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    const user = await this.userModel.findByIdAndUpdate(userId, dto as any, { new: true });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async addToWishlist(userId: string, carId: string) {
    return this.userModel.findByIdAndUpdate(userId, { $addToSet: { wishlist: new Types.ObjectId(carId) } }, { new: true });
  }

  async removeFromWishlist(userId: string, carId: string) {
    return this.userModel.findByIdAndUpdate(userId, { $pull: { wishlist: new Types.ObjectId(carId) } }, { new: true });
  }
}
