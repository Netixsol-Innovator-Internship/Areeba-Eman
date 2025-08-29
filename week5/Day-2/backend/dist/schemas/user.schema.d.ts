import type { Document, Types } from "mongoose";
export declare class User {
    username: string;
    email: string;
    password: string;
    bio: string;
    profilePicture: string;
    followersCount: number;
    followingCount: number;
}
export type UserDocument = User & Document & {
    _id: Types.ObjectId;
};
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
}>;
