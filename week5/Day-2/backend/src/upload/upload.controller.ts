import { Controller, Post, UseInterceptors, UseGuards, BadRequestException, UploadedFile, Req } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UploadService } from "./upload.service";
import { UserService } from "../user/user.service";
import type { Express } from "express";
import { Request } from "express";

@Controller("upload")
export class UploadController {
  constructor(
    private uploadService: UploadService,
    private userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post("profile-picture")
  @UseInterceptors(FileInterceptor("file"))
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    const userId = (req.user as any)._id; // JWT guard attaches user
    const fileUrl = this.uploadService.getFileUrl(file.filename);

    // Update the user's profilePicture in DB
    const updatedUser = await this.userService.updateProfilePic(userId, fileUrl);

    return {
  message: "Profile picture uploaded successfully",
  url: fileUrl,
  profilePicture: updatedUser.profilePicture,
};
  }
}


// import { Controller, Post, UseInterceptors, UseGuards, BadRequestException } from "@nestjs/common"
// import { FileInterceptor } from "@nestjs/platform-express"
// import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
// import { UploadService } from "./upload.service"
// import type { Express } from "express"


// @Controller("upload")
// export class UploadController {
//   constructor(private uploadService: UploadService) {}

//   @UseGuards(JwtAuthGuard)
//   @Post("profile-picture")
//   @UseInterceptors(FileInterceptor("file"))
//   uploadProfilePicture(file: Express.Multer.File) {
//     if (!file) {
//       throw new BadRequestException("No file uploaded")
//     }

//     const fileUrl = this.uploadService.getFileUrl(file.filename)

//     return {
//       message: "Profile picture uploaded successfully",
//       url: fileUrl,
//       filename: file.filename,
//     }
//   }
// }
