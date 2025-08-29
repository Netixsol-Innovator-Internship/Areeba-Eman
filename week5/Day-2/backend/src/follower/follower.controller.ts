import { Controller, Post, Delete, Get, Param, UseGuards, Request } from "@nestjs/common"
import  { FollowerService } from "./follower.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@Controller("followers")
export class FollowerController {
  constructor(private followerService: FollowerService) {}

  @UseGuards(JwtAuthGuard)
  @Post("follow/:userId")
  async followUser(@Request() req, @Param('userId') userId: string) {
    const follow = await this.followerService.followUser(req.user._id, userId)
    return {
      message: "User followed successfully",
      follow,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete("unfollow/:userId")
  async unfollowUser(@Request() req, @Param('userId') userId: string) {
    await this.followerService.unfollowUser(req.user._id, userId)
    return {
      message: "User unfollowed successfully",
    }
  }

  @Get(':userId/followers')
  async getFollowers(@Param('userId') userId: string) {
    const followers = await this.followerService.getFollowers(userId);
    return {
      message: 'Followers retrieved successfully',
      followers,
      count: followers.length,
    };
  }

  @Get(':userId/following')
  async getFollowing(@Param('userId') userId: string) {
    const following = await this.followerService.getFollowing(userId);
    return {
      message: 'Following retrieved successfully',
      following,
      count: following.length,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get("check/:userId")
  async checkIfFollowing(@Request() req, @Param('userId') userId: string) {
    const isFollowing = await this.followerService.isFollowing(req.user._id, userId)
    return {
      message: "Follow status retrieved successfully",
      isFollowing,
    }
  }

  @Get(':userId/stats')
  async getFollowStats(@Param('userId') userId: string) {
    const stats = await this.followerService.getFollowStats(userId);
    return {
      message: 'Follow stats retrieved successfully',
      ...stats,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-followers')
  async getMyFollowers(@Request() req) {
    const followers = await this.followerService.getFollowers(req.user._id);
    return {
      message: 'Your followers retrieved successfully',
      followers,
      count: followers.length,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-following')
  async getMyFollowing(@Request() req) {
    const following = await this.followerService.getFollowing(req.user._id);
    return {
      message: 'Your following retrieved successfully',
      following,
      count: following.length,
    };
  }
}
