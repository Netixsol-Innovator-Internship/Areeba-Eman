import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import type { Model } from "mongoose"
import { Comment, CommentDocument } from "../schemas/comment.schema"
import type { CreateCommentDto, UpdateCommentDto } from "../dto/comment.dto"
import  { NotificationGateway } from "../websocket/notification.gateway"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class CommentService {
   constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private notificationGateway: NotificationGateway, // ✅ must be imported via 
  ) {}

  async create(createCommentDto: CreateCommentDto, authorId: string): Promise<CommentDocument> {
    const comment = new this.commentModel({
      ...createCommentDto,
      author: authorId,
    })

    const savedComment = await comment.save()
    const populatedComment = await savedComment.populate("author", "username profilePicture")

    // If this is a reply, increment parent comment's replies count and emit reply notification
    if (createCommentDto.parentComment) {
      await this.commentModel.findByIdAndUpdate(createCommentDto.parentComment, { $inc: { repliesCount: 1 } })

      // Get parent comment for notification
      const parentComment = await this.commentModel
        .findById(createCommentDto.parentComment)
        .populate("author", "username profilePicture")

      // Emit reply notification
      await this.notificationGateway.emitNewReply(populatedComment, parentComment, authorId)
    } else {
      // Emit new comment notification to all users
      await this.notificationGateway.emitNewComment(populatedComment, authorId)
    }

    return populatedComment
  }

  async findAll(): Promise<CommentDocument[]> {
    return this.commentModel
      .find({ parentComment: null }) // Only top-level comments
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 })
  }

  async findReplies(commentId: string): Promise<CommentDocument[]> {
    return this.commentModel
      .find({ parentComment: commentId })
      .populate("author", "username profilePicture")
      .sort({ createdAt: 1 })
  }

  async findById(id: string): Promise<CommentDocument> {
    const comment = await this.commentModel.findById(id).populate("author", "username profilePicture")

    if (!comment) {
      throw new NotFoundException("Comment not found")
    }

    return comment
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<CommentDocument> {
    const comment = await this.findById(id)
    console.log("comment.author:", comment.author);   //just to debug
    console.log("userId:", userId);                   //just to debug

    if (comment.author._id.toString() !== userId.toString()) {
      throw new ForbiddenException("You can only update your own comments")
    }

    const updatedComment = await this.commentModel
      .findByIdAndUpdate(id, updateCommentDto, { new: true })
      .populate("author", "username profilePicture")

    // Emit real-time update
    this.notificationGateway.emitCommentUpdate(updatedComment)

    return updatedComment
  }

  async delete(id: string, userId: string): Promise<void> {
    const comment = await this.findById(id)

    if (comment.author._id.toString() !== userId.toString()) {
      throw new ForbiddenException("You can only delete your own comments")
    }

    // If this is a reply, decrement parent comment's replies count
    if (comment.parentComment) {
      await this.commentModel.findByIdAndUpdate(comment.parentComment, { $inc: { repliesCount: -1 } })
    }

    // Delete all replies to this comment
    await this.commentModel.deleteMany({ parentComment: id })

    await this.commentModel.findByIdAndDelete(id)

    // Emit real-time deletion
    this.notificationGateway.emitCommentDelete(id)
  }

  async incrementLikesCount(commentId: string): Promise<void> {
    await this.commentModel.findByIdAndUpdate(commentId, {
      $inc: { likesCount: 1 },
    })
  }

  async decrementLikesCount(commentId: string): Promise<void> {
    await this.commentModel.findByIdAndUpdate(commentId, {
      $inc: { likesCount: -1 },
    })
  }
}
