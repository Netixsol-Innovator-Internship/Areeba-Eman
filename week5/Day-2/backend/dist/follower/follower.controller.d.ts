import { FollowerService } from "./follower.service";
export declare class FollowerController {
    private followerService;
    constructor(followerService: FollowerService);
    followUser(req: any, userId: string): Promise<{
        message: string;
        follow: import("../schemas/follower.schema").FollowerDocument;
    }>;
    unfollowUser(req: any, userId: string): Promise<{
        message: string;
    }>;
    getFollowers(userId: string): Promise<{
        message: string;
        followers: import("../schemas/follower.schema").FollowerDocument[];
        count: number;
    }>;
    getFollowing(userId: string): Promise<{
        message: string;
        following: import("../schemas/follower.schema").FollowerDocument[];
        count: number;
    }>;
    checkIfFollowing(req: any, userId: string): Promise<{
        message: string;
        isFollowing: boolean;
    }>;
    getFollowStats(userId: string): Promise<{
        followersCount: number;
        followingCount: number;
        message: string;
    }>;
    getMyFollowers(req: any): Promise<{
        message: string;
        followers: import("../schemas/follower.schema").FollowerDocument[];
        count: number;
    }>;
    getMyFollowing(req: any): Promise<{
        message: string;
        following: import("../schemas/follower.schema").FollowerDocument[];
        count: number;
    }>;
}
