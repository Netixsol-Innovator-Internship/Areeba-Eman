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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const comment_schema_1 = require("../schemas/comment.schema");
const notification_gateway_1 = require("../websocket/notification.gateway");
const mongoose_1 = require("@nestjs/mongoose");
let CommentService = class CommentService {
    constructor(commentModel, notificationGateway) {
        this.commentModel = commentModel;
        this.notificationGateway = notificationGateway;
    }
    async create(createCommentDto, authorId) {
        const comment = new this.commentModel({
            ...createCommentDto,
            author: authorId,
        });
        const savedComment = await comment.save();
        const populatedComment = await savedComment.populate("author", "username profilePicture");
        if (createCommentDto.parentComment) {
            await this.commentModel.findByIdAndUpdate(createCommentDto.parentComment, { $inc: { repliesCount: 1 } });
            const parentComment = await this.commentModel
                .findById(createCommentDto.parentComment)
                .populate("author", "username profilePicture");
            await this.notificationGateway.emitNewReply(populatedComment, parentComment, authorId);
        }
        else {
            await this.notificationGateway.emitNewComment(populatedComment, authorId);
        }
        return populatedComment;
    }
    async findAll() {
        return this.commentModel
            .find({ parentComment: null })
            .populate("author", "username profilePicture")
            .sort({ createdAt: -1 });
    }
    async findReplies(commentId) {
        return this.commentModel
            .find({ parentComment: commentId })
            .populate("author", "username profilePicture")
            .sort({ createdAt: 1 });
    }
    async findById(id) {
        const comment = await this.commentModel.findById(id).populate("author", "username profilePicture");
        if (!comment) {
            throw new common_1.NotFoundException("Comment not found");
        }
        return comment;
    }
    async update(id, updateCommentDto, userId) {
        const comment = await this.findById(id);
        console.log("comment.author:", comment.author);
        console.log("userId:", userId);
        if (comment.author._id.toString() !== userId.toString()) {
            throw new common_1.ForbiddenException("You can only update your own comments");
        }
        const updatedComment = await this.commentModel
            .findByIdAndUpdate(id, updateCommentDto, { new: true })
            .populate("author", "username profilePicture");
        this.notificationGateway.emitCommentUpdate(updatedComment);
        return updatedComment;
    }
    async delete(id, userId) {
        const comment = await this.findById(id);
        if (comment.author._id.toString() !== userId.toString()) {
            throw new common_1.ForbiddenException("You can only delete your own comments");
        }
        if (comment.parentComment) {
            await this.commentModel.findByIdAndUpdate(comment.parentComment, { $inc: { repliesCount: -1 } });
        }
        await this.commentModel.deleteMany({ parentComment: id });
        await this.commentModel.findByIdAndDelete(id);
        this.notificationGateway.emitCommentDelete(id);
    }
    async incrementLikesCount(commentId) {
        await this.commentModel.findByIdAndUpdate(commentId, {
            $inc: { likesCount: 1 },
        });
    }
    async decrementLikesCount(commentId) {
        await this.commentModel.findByIdAndUpdate(commentId, {
            $inc: { likesCount: -1 },
        });
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __metadata("design:paramtypes", [Function, notification_gateway_1.NotificationGateway])
], CommentService);
//# sourceMappingURL=comment.service.js.map