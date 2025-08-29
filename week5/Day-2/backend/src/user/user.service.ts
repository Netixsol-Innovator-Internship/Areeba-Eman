import { Injectable, NotFoundException } from "@nestjs/common"
import type { Model } from "mongoose"
import { InjectModel } from "@nestjs/mongoose"
import { User, UserDocument } from "../schemas/user.schema"
import type { UpdateProfileDto } from "../dto/user.dto"


@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>, 
  ) {}

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select("-password")
    if (!user) {
      throw new NotFoundException("User not found")
    }
    return user
  }

  async findByUsername(username: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ username }).select("-password")
    if (!user) {
      throw new NotFoundException("User not found")
    }
    return user
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(id, updateProfileDto, { new: true }).select("-password")

    if (!user) {
      throw new NotFoundException("User not found")
    }

    return user
  }

  async getAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find().select("-password").sort({ createdAt: -1 })
  }

  async incrementFollowersCount(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $inc: { followersCount: 1 },
    })
  }

  async decrementFollowersCount(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $inc: { followersCount: -1 },
    })
  }

  async incrementFollowingCount(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $inc: { followingCount: 1 },
    })
  }

  async decrementFollowingCount(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $inc: { followingCount: -1 },
    })
  }
//  added new method extra
  async updateProfilePic(userId: string, profilePicUrl: string): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { profilePicture: profilePicUrl },
        { new: true } // return the updated document
      )
      .select("-password");

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }
}
