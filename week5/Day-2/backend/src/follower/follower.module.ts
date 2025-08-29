import { Module, forwardRef } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { FollowerService } from "./follower.service"
import { FollowerController } from "./follower.controller"
import { Follower, FollowerSchema } from "../schemas/follower.schema"
import { UserModule } from "../user/user.module"
import { WebsocketModule } from "../websocket/websocket.module"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Follower.name, schema: FollowerSchema }]),
    UserModule,
    forwardRef(() => WebsocketModule),
  ],
  providers: [FollowerService],
  controllers: [FollowerController],
  exports: [FollowerService],
})
export class FollowerModule {}
