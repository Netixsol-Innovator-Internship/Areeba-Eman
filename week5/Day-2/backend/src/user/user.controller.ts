import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Req,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { UserService } from "./user.service"
import type { UpdateProfileDto } from "../dto/user.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import  { UploadService } from "../upload/upload.service"
import type { Express } from "express"

@Controller("users")
export class UserController {
  constructor(
    private userService: UserService,
    private uploadService: UploadService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getMyProfile(@Req()req: Request) {
    const user = await this.userService.findById((req as any).user._id)
    return {
      message: "Profile retrieved successfully",
      user,
    }
  }

   @UseGuards(JwtAuthGuard)
  @Put("profile")
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const user = await this.userService.updateProfile(
      (req as any).user._id,
      updateProfileDto,
    )
    return {
      message: "Profile updated successfully",
      user,
    }
  }

 @UseGuards(JwtAuthGuard)
  @Post("profile/picture")
  @UseInterceptors(FileInterceptor("file"))
  async uploadProfilePicture(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException("No file uploaded")
    }

    const fileUrl = this.uploadService.getFileUrl(file.filename)

    // Update user's profile picture in database
    const user = await this.userService.updateProfile((req as any).user._id, {
      profilePicture: fileUrl,
    })

    return {
      message: "Profile picture updated successfully",
      user,
      url: fileUrl,
    }
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.userService.findByUsername(username);
    return {
      message: 'User retrieved successfully',
      user,
    };
  }

  @Get()
  async getAllUsers() {
    const users = await this.userService.getAllUsers()
    return {
      message: "Users retrieved successfully",
      users,
    }
  }
}
