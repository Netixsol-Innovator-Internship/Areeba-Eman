import { Module, forwardRef } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { CommentService } from "./comment.service"
import { CommentController } from "./comment.controller"
import { Comment, CommentSchema } from "../schemas/comment.schema"
import { UserModule } from "../user/user.module"
import { WebsocketModule } from "../websocket/websocket.module"
// import { NotificationGateway } from "src/websocket/notification.gateway"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    UserModule,
    forwardRef(() => WebsocketModule),
  ],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
