"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowerService = void 0;
const common_1 = require("@nestjs/common");
const follower_schema_1 = require("../schemas/follower.schema");
const user_service_1 = require("../user/user.service");
const notification_gateway_1 = require("../websocket/notification.gateway");
const mongoose_1 = require("@nestjs/mongoose");
let FollowerService = class FollowerService {
    constructor(followerModel, userService, notificationGateway) {
        this.followerModel = followerModel;
        this.userService = userService;
        this.notificationGateway = notificationGateway;
    }
    async followUser(followerId, followingId) {
        if (followerId === followingId) {
            throw new common_1.BadRequestException("You cannot follow yourself");
        }
        await this.userService.findById(followerId);
        await this.userService.findById(followingId);
        const existingFollow = await this.followerModel.findOne({
            follower: followerId,
            following: followingId,
        });
        if (existingFollow) {
            throw new common_1.ConflictException("You are already following this user");
        }
        const follow = new this.followerModel({
            follower: followerId,
            following: followingId,
        });
        await follow.save();
        const populatedFollow = await follow.populate([
            { path: "follower", select: "username profilePicture" },
            { path: "following", select: "username profilePicture" },
        ]);
        await this.userService.incrementFollowersCount(followingId);
        await this.userService.incrementFollowingCount(followerId);
        await this.notificationGateway.emitNewFollower(populatedFollow, followerId);
        return populatedFollow;
    }
    async unfollowUser(followerId, followingId) {
        const follow = await this.followerModel.findOne({
            follower: followerId,
            following: followingId,
        });
        if (!follow) {
            throw new common_1.NotFoundException("Follow relationship not found");
        }
        await this.followerModel.findByIdAndDelete(follow._id);
        await this.userService.decrementFollowersCount(followingId);
        await this.userService.decrementFollowingCount(followerId);
    }
    async getFollowers(userId) {
        return this.followerModel
            .find({ following: userId })
            .populate("follower", "username profilePicture bio")
            .sort({ createdAt: -1 });
    }
    async getFollowing(userId) {
        return this.followerModel
            .find({ follower: userId })
            .populate("following", "username profilePicture bio")
            .sort({ createdAt: -1 });
    }
    async isFollowing(followerId, followingId) {
        const follow = await this.followerModel.findOne({
            follower: followerId,
            following: followingId,
        });
        return !!follow;
    }
    async getFollowStats(userId) {
        const [followersCount, followingCount] = await Promise.all([
            this.followerModel.countDocuments({ following: userId }),
            this.followerModel.countDocuments({ follower: userId }),
        ]);
        return { followersCount, followingCount };
    }
};
exports.FollowerService = FollowerService;
exports.FollowerService = FollowerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(follower_schema_1.Follower.name)),
    __metadata("design:paramtypes", [Function, user_service_1.UserService,
        notification_gateway_1.NotificationGateway])
], FollowerService);
//# sourceMappingURL=follower.service.js.map