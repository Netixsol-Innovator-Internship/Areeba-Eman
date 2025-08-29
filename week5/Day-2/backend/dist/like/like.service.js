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
exports.LikeService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const like_schema_1 = require("../schemas/like.schema");
const comment_service_1 = require("../comment/comment.service");
const notification_gateway_1 = require("../websocket/notification.gateway");
const mongoose_2 = require("@nestjs/mongoose");
let LikeService = class LikeService {
    constructor(likeModel, commentService, notificationGateway) {
        this.likeModel = likeModel;
        this.commentService = commentService;
        this.notificationGateway = notificationGateway;
    }
    async likeComment(userId, commentId) {
        try {
            const comment = await this.commentService.findById(commentId);
            if (!comment)
                throw new common_1.NotFoundException("Comment not found");
            const existingLike = await this.likeModel.findOne({
                user: userId,
                comment: commentId,
            });
            if (existingLike) {
                throw new common_1.ConflictException("You have already liked this comment");
            }
            const like = new this.likeModel({
                user: userId,
                comment: commentId,
            });
            await like.save();
            const populatedLike = await like.populate("user", "username profilePicture");
            await this.commentService.incrementLikesCount(commentId);
            await this.notificationGateway.emitCommentLike(populatedLike, comment, userId);
            return populatedLike;
        }
        catch (err) {
            console.error("❌ Error in likeComment:", err);
            throw err;
        }
    }
    async unlikeComment(userId, commentId) {
        const like = await this.likeModel.findOne({
            user: userId,
            comment: commentId,
        });
        if (!like) {
            throw new common_1.NotFoundException("Like not found");
        }
        await this.likeModel.findByIdAndDelete(like._id);
        await this.commentService.decrementLikesCount(commentId);
    }
    async getCommentLikes(commentId) {
        return this.likeModel
            .find({ comment: commentId })
            .populate("user", "username profilePicture")
            .sort({ createdAt: -1 });
    }
    async getUserLikes(userId) {
        return this.likeModel.find({ user: userId }).populate("comment").sort({ createdAt: -1 });
    }
    async isCommentLikedByUser(userId, commentId) {
        const like = await this.likeModel.findOne({
            user: userId,
            comment: commentId,
        });
        return !!like;
    }
};
exports.LikeService = LikeService;
exports.LikeService = LikeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(like_schema_1.Like.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        comment_service_1.CommentService,
        notification_gateway_1.NotificationGateway])
], LikeService);
//# sourceMappingURL=like.service.js.map