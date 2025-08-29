import type { Model } from "mongoose";
import { FollowerDocument } from "../schemas/follower.schema";
import { UserService } from "../user/user.service";
import { NotificationGateway } from "../websocket/notification.gateway";
export declare class FollowerService {
    private followerModel;
    private userService;
    private notificationGateway;
    constructor(followerModel: Model<FollowerDocument>, userService: UserService, notificationGateway: NotificationGateway);
    followUser(followerId: string, followingId: string): Promise<FollowerDocument>;
    unfollowUser(followerId: string, followingId: string): Promise<void>;
    getFollowers(userId: string): Promise<FollowerDocument[]>;
    getFollowing(userId: string): Promise<FollowerDocument[]>;
    isFollowing(followerId: string, followingId: string): Promise<boolean>;
    getFollowStats(userId: string): Promise<{
        followersCount: number;
        followingCount: number;
    }>;
}
