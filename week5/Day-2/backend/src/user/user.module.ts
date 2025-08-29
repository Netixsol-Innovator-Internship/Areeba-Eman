import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { UserService } from "./user.service"
import { UserController } from "./user.controller"
import { User, UserSchema } from "../schemas/user.schema"
import { UploadModule } from "../upload/upload.module"
import { forwardRef } from "@nestjs/common"

@Module({
  imports: [forwardRef(() => UploadModule),MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
  
})
export class UserModule {}
