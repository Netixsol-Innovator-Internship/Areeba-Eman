import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderStatus } from './schemas/order.schema';
import { CartsService } from '../carts/carts.service';
import { ProductsService } from '../products/products.service';
import { SocketGateway } from '../socket/socket.gateway';
@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private model: Model<Order>, private carts: CartsService, private products: ProductsService, private socket: SocketGateway) {}
  async checkout(user: any, addressInfo: any, paymentInfo: any) {
    const cart = await this.carts.myCart(user.sub);
    let subtotal = 0;
    const items: any[] = [];
    for (const it of cart.items) {
      const product = await this.products.findOne(it.productId.toString());
      if (!product) {
          throw new NotFoundException('Product not found');
        }
      await this.products.adjustStockOnOrder(product._id.toString(), it.quantity);
      const line = { productId: new Types.ObjectId(product._id), name: product.name, unitPrice: product.price, quantity: it.quantity, lineTotal: product.price * it.quantity };
      items.push(line);
      subtotal += line.lineTotal;
    }
    let discount = 0;
    const firstOrder = await this.model.countDocuments({ userId: user.sub });
    if (firstOrder === 0) discount = subtotal * 0.2;
    const deliveryCharges = 15;
    const total = subtotal - discount + deliveryCharges;
    const order = await this.model.create({ userId: new Types.ObjectId(user.sub), items, addressInfo, paymentInfo, subtotal, discount, deliveryCharges, total });
    await this.carts.clear(user.sub);
    this.socket.notifyAdmins('orderPlaced', { orderId: order._id.toString(), userId: user.sub, total });
    return order;
  }
  listRecent(days = 4) { const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000); return this.model.find({ createdAt: { $gte: since } }); }
  listTotal() { return this.model.countDocuments(); }
  listByProduct(productId: string) { return this.model.find({ 'items.productId': new Types.ObjectId(productId) }); }
  listMine(userId: string) { return this.model.find({ userId }); }
  listByStatus(status: OrderStatus) { return this.model.find({ status }); }
  async updateStatus(orderId: string, status: OrderStatus) { const order = await this.model.findByIdAndUpdate(orderId, { status }, { new: true }); if (order) { this.socket.notifyUser(order.userId.toString(), 'orderStatus', { orderId: order._id.toString(), status }); } return order; }
}
