import { Injectable, ConflictException, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Model } from "mongoose"
import { Follower, FollowerDocument } from "../schemas/follower.schema"
import { UserService } from "../user/user.service"
import { NotificationGateway } from "../websocket/notification.gateway"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class FollowerService {
  
  constructor(
    @InjectModel(Follower.name)private followerModel: Model<FollowerDocument>,
    private userService: UserService,
    private notificationGateway: NotificationGateway

  ) {}

  async followUser(followerId: string, followingId: string): Promise<FollowerDocument> {
    // Check if trying to follow themselves
    if (followerId === followingId) {
      throw new BadRequestException("You cannot follow yourself")
    }

    // Check if users exist
    await this.userService.findById(followerId)
    await this.userService.findById(followingId)

    // Check if already following
    const existingFollow = await this.followerModel.findOne({
      follower: followerId,
      following: followingId,
    })

    if (existingFollow) {
      throw new ConflictException("You are already following this user")
    }

    // Create follow relationship
    const follow = new this.followerModel({
      follower: followerId,
      following: followingId,
    })

    await follow.save()
    const populatedFollow = await follow.populate([
      { path: "follower", select: "username profilePicture" },
      { path: "following", select: "username profilePicture" },
    ])

    // Update counters
    await this.userService.incrementFollowersCount(followingId)
    await this.userService.incrementFollowingCount(followerId)

    // Emit follow notification
    await this.notificationGateway.emitNewFollower(populatedFollow, followerId)

    return populatedFollow
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const follow = await this.followerModel.findOne({
      follower: followerId,
      following: followingId,
    })

    if (!follow) {
      throw new NotFoundException("Follow relationship not found")
    }

    await this.followerModel.findByIdAndDelete(follow._id)

    // Update counters
    await this.userService.decrementFollowersCount(followingId)
    await this.userService.decrementFollowingCount(followerId)
  }

  async getFollowers(userId: string): Promise<FollowerDocument[]> {
    return this.followerModel
      .find({ following: userId })
      .populate("follower", "username profilePicture bio")
      .sort({ createdAt: -1 })
  }

  async getFollowing(userId: string): Promise<FollowerDocument[]> {
    return this.followerModel
      .find({ follower: userId })
      .populate("following", "username profilePicture bio")
      .sort({ createdAt: -1 })
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.followerModel.findOne({
      follower: followerId,
      following: followingId,
    })
    return !!follow
  }

  async getFollowStats(userId: string): Promise<{ followersCount: number; followingCount: number }> {
    const [followersCount, followingCount] = await Promise.all([
      this.followerModel.countDocuments({ following: userId }),
      this.followerModel.countDocuments({ follower: userId }),
    ])

    return { followersCount, followingCount }
  }
}
