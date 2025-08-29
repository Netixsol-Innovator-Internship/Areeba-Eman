import { Injectable, ConflictException, NotFoundException } from "@nestjs/common"
import { Model } from "mongoose"
import {Like, LikeDocument } from "../schemas/like.schema"
import { CommentService } from "../comment/comment.service"
import  { NotificationGateway } from "../websocket/notification.gateway"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class LikeService {
  constructor(
   @InjectModel(Like.name) private readonly likeModel: Model<LikeDocument>,
    private readonly commentService: CommentService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async likeComment(userId: string, commentId: string): Promise<LikeDocument> {
    try {
    // Check if comment exists
    const comment = await this.commentService.findById(commentId)
    if (!comment) throw new NotFoundException("Comment not found");

    // Check if user already liked this comment
    const existingLike = await this.likeModel.findOne({
      user: userId,
      comment: commentId,
    })

    if (existingLike) {
      throw new ConflictException("You have already liked this comment")
    }

    // Create like
    const like = new this.likeModel({
      user: userId,
      comment: commentId,
    })

    await like.save()
    const populatedLike = await like.populate("user", "username profilePicture")

    // Increment comment likes count
    await this.commentService.incrementLikesCount(commentId)

    // Emit like notification
    await this.notificationGateway.emitCommentLike(populatedLike, comment, userId)

    return populatedLike
  } catch (err) {
    console.error("❌ Error in likeComment:", err);
    throw err;
  } }

  async unlikeComment(userId: string, commentId: string): Promise<void> {
    const like = await this.likeModel.findOne({
      user: userId,
      comment: commentId,
    })

    if (!like) {
      throw new NotFoundException("Like not found")
    }

    await this.likeModel.findByIdAndDelete(like._id)

    // Decrement comment likes count
    await this.commentService.decrementLikesCount(commentId)
  }

  async getCommentLikes(commentId: string): Promise<LikeDocument[]> {
    return this.likeModel
      .find({ comment: commentId })
      .populate("user", "username profilePicture")
      .sort({ createdAt: -1 })
  }

  async getUserLikes(userId: string): Promise<LikeDocument[]> {
    return this.likeModel.find({ user: userId }).populate("comment").sort({ createdAt: -1 })
  }

  async isCommentLikedByUser(userId: string, commentId: string): Promise<boolean> {
    const like = await this.likeModel.findOne({
      user: userId,
      comment: commentId,
    })
    return !!like
  }
}
