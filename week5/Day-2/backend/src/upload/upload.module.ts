import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { MulterModule } from "@nestjs/platform-express"
import { diskStorage } from "multer"
import { extname } from "path"
import { UploadService } from "./upload.service"
import { UploadController } from "./upload.controller"
import { UserModule } from "../user/user.module"
import { forwardRef } from "@nestjs/common";

@Module({
  imports: [
    forwardRef(() => UserModule),
    ConfigModule,
    MulterModule.register({
      storage: diskStorage({
        destination: "./uploads/profiles",
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
          const ext = extname(file.originalname)
          const filename = `profile-${uniqueSuffix}${ext}`
          callback(null, filename)
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error("Only image files are allowed!"), false)
        }
        callback(null, true)
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  ],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule {}
