import { Request } from "express";
import { CommentService } from "./comment.service";
import { CreateCommentDto, UpdateCommentDto } from "../dto/comment.dto";
export declare class CommentController {
    private commentService;
    constructor(commentService: CommentService);
    create(createCommentDto: CreateCommentDto, req: Request): Promise<{
        message: string;
        comment: import("../schemas/comment.schema").CommentDocument;
    }>;
    findAll(): Promise<{
        message: string;
        comments: import("../schemas/comment.schema").CommentDocument[];
    }>;
    findReplies(id: string): Promise<{
        message: string;
        replies: import("../schemas/comment.schema").CommentDocument[];
    }>;
    findOne(id: string): Promise<{
        message: string;
        comment: import("../schemas/comment.schema").CommentDocument;
    }>;
    update(id: string, updateCommentDto: UpdateCommentDto, req: Request): Promise<{
        message: string;
        comment: import("../schemas/comment.schema").CommentDocument;
    }>;
    remove(id: string, req: Request): Promise<{
        message: string;
    }>;
}
