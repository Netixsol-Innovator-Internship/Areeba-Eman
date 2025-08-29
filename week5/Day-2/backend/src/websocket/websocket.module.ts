import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { NotificationGateway } from "./notification.gateway"
import { NotificationModule } from "../notification/notification.module"

@Module({
  imports: [
    NotificationModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "my_secret_key",
      signOptions: { expiresIn: "24h" },
    }),
  ],
  providers: [NotificationGateway],
  exports: [NotificationGateway],
})
export class WebsocketModule {}