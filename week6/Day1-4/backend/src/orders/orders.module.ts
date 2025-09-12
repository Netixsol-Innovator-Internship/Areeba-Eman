import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { CartsModule } from '../carts/carts.module';
import { ProductsModule } from '../products/products.module';
import { SocketGateway } from '../socket/socket.gateway';
import { NotificationsModule } from '../notifications/notifications.module';
import { Stripe } from 'stripe';
import { UsersModule } from 'src/users/users.module';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CartsModule,
    ProductsModule,
    NotificationsModule,
    UsersModule,
    StripeModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    SocketGateway,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}

// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { OrdersService } from './orders.service';
// import { OrdersController } from './orders.controller';
// import { Order, OrderSchema } from './schemas/order.schema';
// import { CartsModule } from '../carts/carts.module';
// import { ProductsModule } from '../products/products.module';
// import { SocketGateway } from '../socket/socket.gateway';
// import { User, UserSchema } from '../users/schemas/user.schema';
// import { NotificationsModule } from '../notifications/notifications.module';  

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
//     MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // <-- Add this
//     CartsModule,
//     ProductsModule,
//     NotificationsModule,
//   ],
//   providers: [OrdersService, SocketGateway],
//   controllers: [OrdersController],
// })
// export class OrdersModule {}
