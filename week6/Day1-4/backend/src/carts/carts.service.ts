import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { ProductsService } from '../products/products.service';
@Injectable()
export class CartsService {
  constructor(@InjectModel(Cart.name) private model: Model<CartDocument>, private products: ProductsService) {}
  private async ensure(userId: string) { let cart = await this.model.findOne({ userId }); if (!cart) cart = await this.model.create({ userId, items: [] }); return cart; }
  async myCart(userId: string) {
    const cart = await this.ensure(userId);
    const subtotal = cart.items.reduce((s, it) => s + it.priceAtAdd * it.quantity, 0);
    const deliveryFee = 15;
    const total = subtotal + deliveryFee;
    return { ...cart.toObject(), subtotal, deliveryFee, total };
  }
  async add(userId: string, productId: string, qty = 1) {
    const product = await this.products.findOne(productId);
    if (!product) {
    throw new NotFoundException('Product not found');
  }

    const cart = await this.ensure(userId);
    const idx = cart.items.findIndex(i => i.productId.toString() === productId);
    if (idx >= 0) cart.items[idx].quantity += qty;
    else cart.items.push({ productId: new Types.ObjectId(productId), quantity: qty, priceAtAdd: product.price } as any);
    await cart.save();
    return this.myCart(userId);
  }
  async remove(userId: string, productId: string) {
    const cart = await this.ensure(userId);
    cart.items = cart.items.filter(i => i.productId.toString() !== productId);
    await cart.save();
    return this.myCart(userId);
  }
  async changeQty(userId: string, productId: string, qty: number) {
    const cart = await this.ensure(userId);
    const it = cart.items.find(i => i.productId.toString() === productId);
    if (it) { it.quantity = Math.max(1, qty); await cart.save(); }
    return this.myCart(userId);
  }
  async clear(userId: string) { const cart = await this.ensure(userId); cart.items = []; await cart.save(); }
}
