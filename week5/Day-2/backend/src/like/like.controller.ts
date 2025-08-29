import { Controller, Post, Get, UseGuards, Req, Param } from "@nestjs/common";
import { LikeService } from "./like.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";

@Controller("likes")
export class LikeController {
  constructor(private likeService: LikeService) {}

  // 🔥 Toggle Like/Unlike
  @UseGuards(JwtAuthGuard)
  @Post("comment/:commentId")
  async toggleLike(
    @Param("commentId") commentId: string,
    @Req() req: Request
  ) {
    const user = req.user as any;

    const isLiked = await this.likeService.isCommentLikedByUser(user._id, commentId);

    if (isLiked) {
      await this.likeService.unlikeComment(user._id, commentId);
      return {
        message: "Comment unliked successfully",
        liked: false,
      };
    } else {
      await this.likeService.likeComment(user._id, commentId);
      return {
        message: "Comment liked successfully",
        liked: true,
      };
    }
  }

  @Get("comment/:commentId")
  async getCommentLikes(@Param("commentId") commentId: string) {
    const likes = await this.likeService.getCommentLikes(commentId);
    return {
      message: "Comment likes retrieved successfully",
      likes,
      count: likes.length,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get("user/my-likes")
  async getMyLikes(@Req() req: Request) {
    const user = req.user as any;
    const likes = await this.likeService.getUserLikes(user._id);
    return {
      message: "Your likes retrieved successfully",
      likes,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get("comment/:commentId/check")
  async checkIfLiked(
    @Param("commentId") commentId: string,
    @Req() req: Request
  ) {
    const user = req.user as any;
    const isLiked = await this.likeService.isCommentLikedByUser(user._id, commentId);
    return {
      message: "Like status retrieved successfully",
      isLiked,
    };
  }
}

// import { Controller, Post, Delete, Get, UseGuards, Req, Param } from "@nestjs/common";
// import { LikeService } from "./like.service";
// import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
// import { Request } from "express";

// @Controller("likes")
// export class LikeController {
//   constructor(private likeService: LikeService) {}

//   @UseGuards(JwtAuthGuard)
//   @Post("comment/:commentId")
//   async likeComment(
//     @Param("commentId") commentId: string,
//     @Req() req: Request
//   ) {
//     const user = req.user as any;
//     const like = await this.likeService.likeComment(user._id, commentId);
//     return {
//       message: "Comment liked successfully",
//       like,
//     };
//   }

//   @UseGuards(JwtAuthGuard)
//   @Delete("comment/:commentId")
//   async unlikeComment(
//     @Param("commentId") commentId: string,
//     @Req() req: Request
//   ) {
//     const user = req.user as any;
//     await this.likeService.unlikeComment(user._id, commentId);
//     return {
//       message: "Comment unliked successfully",
//     };
//   }

//   @Get("comment/:commentId")
//   async getCommentLikes(@Param("commentId") commentId: string) {
//     const likes = await this.likeService.getCommentLikes(commentId);
//     return {
//       message: "Comment likes retrieved successfully",
//       likes,
//       count: likes.length,
//     };
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get("user/my-likes")
//   async getMyLikes(@Req() req: Request) {
//     const user = req.user as any;
//     const likes = await this.likeService.getUserLikes(user._id);
//     return {
//       message: "Your likes retrieved successfully",
//       likes,
//     };
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get("comment/:commentId/check")
//   async checkIfLiked(
//     @Param("commentId") commentId: string,
//     @Req() req: Request
//   ) {
//     const user = req.user as any;
//     const isLiked = await this.likeService.isCommentLikedByUser(user._id, commentId);
//     return {
//       message: "Like status retrieved successfully",
//       isLiked,
//     };
//   }
// }



