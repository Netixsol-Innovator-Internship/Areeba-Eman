import type { Model } from "mongoose";
import { UserDocument } from "../schemas/user.schema";
import type { UpdateProfileDto } from "../dto/user.dto";
export declare class UserService {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    findById(id: string): Promise<UserDocument>;
    findByUsername(username: string): Promise<UserDocument>;
    updateProfile(id: string, updateProfileDto: UpdateProfileDto): Promise<UserDocument>;
    getAllUsers(): Promise<UserDocument[]>;
    incrementFollowersCount(userId: string): Promise<void>;
    decrementFollowersCount(userId: string): Promise<void>;
    incrementFollowingCount(userId: string): Promise<void>;
    decrementFollowingCount(userId: string): Promise<void>;
    updateProfilePic(userId: string, profilePicUrl: string): Promise<UserDocument>;
}
