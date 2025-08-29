import type { Model } from "mongoose";
import { CommentDocument } from "../schemas/comment.schema";
import type { CreateCommentDto, UpdateCommentDto } from "../dto/comment.dto";
import { NotificationGateway } from "../websocket/notification.gateway";
export declare class CommentService {
    private commentModel;
    private notificationGateway;
    constructor(commentModel: Model<CommentDocument>, notificationGateway: NotificationGateway);
    create(createCommentDto: CreateCommentDto, authorId: string): Promise<CommentDocument>;
    findAll(): Promise<CommentDocument[]>;
    findReplies(commentId: string): Promise<CommentDocument[]>;
    findById(id: string): Promise<CommentDocument>;
    update(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<CommentDocument>;
    delete(id: string, userId: string): Promise<void>;
    incrementLikesCount(commentId: string): Promise<void>;
    decrementLikesCount(commentId: string): Promise<void>;
}
