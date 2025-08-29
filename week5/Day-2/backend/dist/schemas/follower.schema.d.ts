import { type Document, Types } from "mongoose";
export type FollowerDocument = Follower & Document;
export declare class Follower {
    follower: Types.ObjectId;
    following: Types.ObjectId;
}
export declare const FollowerSchema: import("mongoose").Schema<Follower, import("mongoose").Model<Follower, any, any, any, Document<unknown, any, Follower> & Follower & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Follower, Document<unknown, {}, import("mongoose").FlatRecord<Follower>> & import("mongoose").FlatRecord<Follower> & {
    _id: Types.ObjectId;
}>;
