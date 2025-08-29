import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { NotificationService } from "./notification.service"
import { NotificationController } from "./notification.controller"
import { Notification, NotificationSchema } from "../schemas/notification.schema"
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from "src/auth/auth.module"

@Module({
  imports: [AuthModule,ConfigModule, MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }])],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
