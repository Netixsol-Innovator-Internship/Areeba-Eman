import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderStatus } from './schemas/order.schema';
import { CartsService } from '../carts/carts.service';
import { ProductsService } from '../products/products.service';
import { SocketGateway } from '../socket/socket.gateway';
import { User } from '../users/schemas/user.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private model: Model<Order>,
    private carts: CartsService,
    private products: ProductsService,
    private socket: SocketGateway,
    private notifications: NotificationsService, 
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async checkout(user: any, addressInfo: any, paymentInfo: any, usePoints = false) {
  const cart = await this.carts.myCart(user.sub);
  const buyer = await this.userModel.findById(user.sub);
  if (!buyer) throw new NotFoundException('User not found');

  let subtotal = 0;
  const items: any[] = [];

  for (const it of cart.items) {
    const product = await this.products.findOne(it.productId.toString());
    if (!product) throw new NotFoundException('Product not found');

    // Adjust stock
    await this.products.adjustStockOnOrder(product._id.toString(), it.quantity);

    // Calculate price with sale if applicable
    const price = product.sale && product.discount > 0
      ? parseFloat((product.price * (1 - product.discount / 100)).toFixed(2))
      : product.price;

    // Loyalty points handling
    if (usePoints && product.pointsPrice > 0) {
      const totalPointsNeeded = product.pointsPrice * it.quantity;
      if (buyer.loyaltyPoints < totalPointsNeeded) {
        throw new BadRequestException('Not enough loyalty points');
      }
      buyer.loyaltyPoints -= totalPointsNeeded;
    } else {
      buyer.loyaltyPoints += product.loyaltyPoints * it.quantity;
    }

    // Prepare order line item
    const line = {
      productId: new Types.ObjectId(product._id),
      name: product.name,
      unitPrice: price,
      quantity: it.quantity,
      lineTotal: price * it.quantity,
    };

    items.push(line);
    subtotal += line.lineTotal;
  }

  await buyer.save();

  // Apply first-order discount
  let discount = 0;
  const firstOrder = await this.model.countDocuments({ userId: user.sub });
  if (firstOrder === 0) discount = subtotal * 0.2;

  const deliveryCharges = 15;
  const total = subtotal - discount + deliveryCharges;

const order = await this.model.create({
  userId: new Types.ObjectId(user.sub),
  items,
  addressInfo,
  paymentInfo,
  subtotal,
  discount,
  deliveryCharges,
  total,
});

    await this.carts.clear(user.sub);

    // 🔥 Notify admins about the order
    this.socket.notifyAdmins('orderPlaced', {
      orderId: order._id.toString(),
      userId: user.sub,
      total,
    });

    // 🔥 Save notification for user
    await this.notifications.notifyUser(user.sub, 'orderPlaced', {
      orderId: order._id.toString(),
      total,
    });

    // 🔥 Notify the user via socket (use order.status)
    this.socket.notifyUser(order.userId.toString(), 'orderPlaced', {
      orderId: order._id.toString(),
      status: order.status, // ✅ FIXED
    });

    return order;
  }

  listRecent(days = 4) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.model.find({ createdAt: { $gte: since } });
  }

  listTotal() {
    return this.model.countDocuments();
  }

  listByProduct(productId: string) {
    return this.model.find({ 'items.productId': new Types.ObjectId(productId) });
  }

  listMine(userId: string) {
  return this.model.find({ userId: new Types.ObjectId(userId) });
  }

  listByStatus(status: OrderStatus) {
    return this.model.find({ status });
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    const order = await this.model.findByIdAndUpdate(orderId, { status }, { new: true });
    if (order) {
      this.socket.notifyUser(order.userId.toString(), 'orderStatus', {
        orderId: order._id.toString(),
        status,
      });
    }
    return order;
  }
}
