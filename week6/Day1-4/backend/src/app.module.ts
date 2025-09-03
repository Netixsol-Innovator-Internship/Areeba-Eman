import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/carts.module';
import { RatingsModule } from './ratings/ratings.module';
import { OrdersModule } from './orders/orders.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MailerModule } from './mailer/mailer.module';
import { SocketModule } from './socket/socket.module';
import { AdminModule } from './admin/admin.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || ''),
    MailerModule,
    SocketModule,
    NotificationsModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    CartsModule,
    RatingsModule,
    OrdersModule,
    AdminModule,
  ],
})
export class AppModule {}
