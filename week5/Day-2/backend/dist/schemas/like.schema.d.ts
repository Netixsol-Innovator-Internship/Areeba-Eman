import { type Document, Types } from "mongoose";
export type LikeDocument = Like & Document;
export declare class Like {
    user: Types.ObjectId;
    comment: Types.ObjectId;
}
export declare const LikeSchema: import("mongoose").Schema<Like, import("mongoose").Model<Like, any, any, any, Document<unknown, any, Like> & Like & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Like, Document<unknown, {}, import("mongoose").FlatRecord<Like>> & import("mongoose").FlatRecord<Like> & {
    _id: Types.ObjectId;
}>;
