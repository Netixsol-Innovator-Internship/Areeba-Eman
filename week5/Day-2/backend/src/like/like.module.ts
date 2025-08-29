import { Module, forwardRef } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { LikeService } from "./like.service"
import { LikeController } from "./like.controller"
import { Like, LikeSchema } from "../schemas/like.schema"
import { CommentModule } from "../comment/comment.module"
import { WebsocketModule } from "../websocket/websocket.module"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    CommentModule,
    forwardRef(() => WebsocketModule),
  ],
  providers: [LikeService],
  controllers: [LikeController],
  exports: [LikeService],
})
export class LikeModule {}
