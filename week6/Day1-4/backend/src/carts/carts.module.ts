import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { Cart, CartSchema } from './schemas/cart.schema';
import { ProductsModule } from '../products/products.module';
@Module({ imports: [MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]), ProductsModule], providers: [CartsService], controllers: [CartsController], exports: [CartsService], })
export class CartsModule {}
