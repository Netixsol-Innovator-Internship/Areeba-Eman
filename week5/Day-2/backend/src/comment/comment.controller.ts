import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from "@nestjs/common";
import { Request } from "express";
import { CommentService } from "./comment.service";
import  { CreateCommentDto, UpdateCommentDto } from "../dto/comment.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("comments")
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
    async create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
  // async create(@Body() createCommentDto: any, @Req() req: Request) {
    console.log('createCommentDto:',createCommentDto)
    console.log('req.user!._id:',req.user!._id)
    const comment = await this.commentService.create(createCommentDto, req.user!._id);
    return {
      message: "Comment created successfully",
      comment,
    };
  }

  @Get()
  async findAll() {
    const comments = await this.commentService.findAll();
    return {
      message: "Comments retrieved successfully",
      comments,
    };
  }

  @Get(':id/replies')
  async findReplies(@Param('id') id: string) {
    const replies = await this.commentService.findReplies(id);
    return {
      message: 'Replies retrieved successfully',
      replies,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const comment = await this.commentService.findById(id);
    return {
      message: 'Comment retrieved successfully',
      comment,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Req() req: Request) {
    const comment = await this.commentService.update(id, updateCommentDto, req.user!._id);
    return {
      message: "Comment updated successfully",
      comment,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param('id') id: string, @Req() req: Request) {
    await this.commentService.delete(id, req.user!._id);
    return {
      message: "Comment deleted successfully",
    };
  }
}

// import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from "@nestjs/common"
// import { Request } from "express"
// import  { CommentService } from "./comment.service"
// import type { CreateCommentDto, UpdateCommentDto } from "../dto/comment.dto"
// import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

// @Controller("comments")
// export class CommentController {
//   constructor(private commentService: CommentService) {}

//   @UseGuards(JwtAuthGuard)
//   @Post()
//   async create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
//     const comment = await this.commentService.create(createCommentDto, (req as any).user._id)
//     return {
//       message: "Comment created successfully",
//       comment,
//     }
//   }

//   @Get()
//   async findAll() {
//     const comments = await this.commentService.findAll()
//     return {
//       message: "Comments retrieved successfully",
//       comments,
//     }
//   }

//   @Get(':id/replies')
//   async findReplies(@Param('id') id: string) {
//     const replies = await this.commentService.findReplies(id);
//     return {
//       message: 'Replies retrieved successfully',
//       replies,
//     };
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: string) {
//     const comment = await this.commentService.findById(id);
//     return {
//       message: 'Comment retrieved successfully',
//       comment,
//     };
//   }

//   @UseGuards(JwtAuthGuard)
//   @Put(":id")
//   async update(@Param('id') id: string, updateCommentDto: UpdateCommentDto, @Req() req: Request) {
//     const comment = await this.commentService.update(id, updateCommentDto,  (req as any).user._id)
//     return {
//       message: "Comment updated successfully",
//       comment,
//     }
//   }

//   @UseGuards(JwtAuthGuard)
//   @Delete(":id")
//   async remove(@Param('id') id: string, @Req() req: Request) {
//     await this.commentService.delete(id, (req as any).user._id)
//     return {
//       message: "Comment deleted successfully",
//     }
//   }
// }
