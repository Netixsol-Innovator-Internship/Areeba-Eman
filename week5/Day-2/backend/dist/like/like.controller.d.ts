import { LikeService } from "./like.service";
import { Request } from "express";
export declare class LikeController {
    private likeService;
    constructor(likeService: LikeService);
    toggleLike(commentId: string, req: Request): Promise<{
        message: string;
        liked: boolean;
    }>;
    getCommentLikes(commentId: string): Promise<{
        message: string;
        likes: import("../schemas/like.schema").LikeDocument[];
        count: number;
    }>;
    getMyLikes(req: Request): Promise<{
        message: string;
        likes: import("../schemas/like.schema").LikeDocument[];
    }>;
    checkIfLiked(commentId: string, req: Request): Promise<{
        message: string;
        isLiked: boolean;
    }>;
}
