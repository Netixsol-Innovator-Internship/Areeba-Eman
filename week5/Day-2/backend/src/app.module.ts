import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { ServeStaticModule } from "@nestjs/serve-static"
import { join } from "path"
import { AuthModule } from "./auth/auth.module"
import { UserModule } from "./user/user.module"
import { CommentModule } from "./comment/comment.module"
import { NotificationModule } from "./notification/notification.module"
import { FollowerModule } from "./follower/follower.module"
import { LikeModule } from "./like/like.module"
import { WebsocketModule } from "./websocket/websocket.module"
import { UploadModule } from "./upload/upload.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
      serveRoot: "/uploads",
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || "mongodb://localhost:27017/comment-system"),
    AuthModule,
    UserModule,
    CommentModule,
    NotificationModule,
    FollowerModule,
    LikeModule,
    WebsocketModule,
    UploadModule,
  ],
})
export class AppModule {}
