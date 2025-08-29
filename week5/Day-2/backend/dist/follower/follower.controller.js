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
exports.FollowerController = void 0;
const common_1 = require("@nestjs/common");
const follower_service_1 = require("./follower.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let FollowerController = class FollowerController {
    constructor(followerService) {
        this.followerService = followerService;
    }
    async followUser(req, userId) {
        const follow = await this.followerService.followUser(req.user._id, userId);
        return {
            message: "User followed successfully",
            follow,
        };
    }
    async unfollowUser(req, userId) {
        await this.followerService.unfollowUser(req.user._id, userId);
        return {
            message: "User unfollowed successfully",
        };
    }
    async getFollowers(userId) {
        const followers = await this.followerService.getFollowers(userId);
        return {
            message: 'Followers retrieved successfully',
            followers,
            count: followers.length,
        };
    }
    async getFollowing(userId) {
        const following = await this.followerService.getFollowing(userId);
        return {
            message: 'Following retrieved successfully',
            following,
            count: following.length,
        };
    }
    async checkIfFollowing(req, userId) {
        const isFollowing = await this.followerService.isFollowing(req.user._id, userId);
        return {
            message: "Follow status retrieved successfully",
            isFollowing,
        };
    }
    async getFollowStats(userId) {
        const stats = await this.followerService.getFollowStats(userId);
        return {
            message: 'Follow stats retrieved successfully',
            ...stats,
        };
    }
    async getMyFollowers(req) {
        const followers = await this.followerService.getFollowers(req.user._id);
        return {
            message: 'Your followers retrieved successfully',
            followers,
            count: followers.length,
        };
    }
    async getMyFollowing(req) {
        const following = await this.followerService.getFollowing(req.user._id);
        return {
            message: 'Your following retrieved successfully',
            following,
            count: following.length,
        };
    }
};
exports.FollowerController = FollowerController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("follow/:userId"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FollowerController.prototype, "followUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)("unfollow/:userId"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FollowerController.prototype, "unfollowUser", null);
__decorate([
    (0, common_1.Get)(':userId/followers'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FollowerController.prototype, "getFollowers", null);
__decorate([
    (0, common_1.Get)(':userId/following'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FollowerController.prototype, "getFollowing", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("check/:userId"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FollowerController.prototype, "checkIfFollowing", null);
__decorate([
    (0, common_1.Get)(':userId/stats'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FollowerController.prototype, "getFollowStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my-followers'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FollowerController.prototype, "getMyFollowers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my-following'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FollowerController.prototype, "getMyFollowing", null);
exports.FollowerController = FollowerController = __decorate([
    (0, common_1.Controller)("followers"),
    __metadata("design:paramtypes", [follower_service_1.FollowerService])
], FollowerController);
//# sourceMappingURL=follower.controller.js.map