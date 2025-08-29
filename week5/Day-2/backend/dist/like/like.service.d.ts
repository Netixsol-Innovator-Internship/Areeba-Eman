import { Model } from "mongoose";
import { LikeDocument } from "../schemas/like.schema";
import { CommentService } from "../comment/comment.service";
import { NotificationGateway } from "../websocket/notification.gateway";
export declare class LikeService {
    private readonly likeModel;
    private readonly commentService;
    private readonly notificationGateway;
    constructor(likeModel: Model<LikeDocument>, commentService: CommentService, notificationGateway: NotificationGateway);
    likeComment(userId: string, commentId: string): Promise<LikeDocument>;
    unlikeComment(userId: string, commentId: string): Promise<void>;
    getCommentLikes(commentId: string): Promise<LikeDocument[]>;
    getUserLikes(userId: string): Promise<LikeDocument[]>;
    isCommentLikedByUser(userId: string, commentId: string): Promise<boolean>;
}
