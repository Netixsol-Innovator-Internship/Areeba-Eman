import { type Document, Types } from "mongoose";
export type CommentDocument = Comment & Document;
export declare class Comment {
    content: string;
    author: Types.ObjectId;
    parentComment: Types.ObjectId;
    likesCount: number;
    repliesCount: number;
}
export declare const CommentSchema: import("mongoose").Schema<Comment, import("mongoose").Model<Comment, any, any, any, Document<unknown, any, Comment> & Comment & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Comment, Document<unknown, {}, import("mongoose").FlatRecord<Comment>> & import("mongoose").FlatRecord<Comment> & {
    _id: Types.ObjectId;
}>;
