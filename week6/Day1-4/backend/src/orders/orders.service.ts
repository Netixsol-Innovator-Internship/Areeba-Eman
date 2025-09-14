import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderStatus } from './schemas/order.schema';
import { CartsService } from '../carts/carts.service';
import { ProductsService } from '../products/products.service';
import { SocketGateway } from '../socket/socket.gateway';
import { User } from '../users/schemas/user.schema';
import { NotificationsService } from '../notifications/notifications.service';
import Stripe from 'stripe';
import { CheckoutDto } from './dto/checkout.dto';
import * as process from 'process';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Order.name) private model: Model<Order>,
    @Inject('STRIPE_CLIENT') private stripe: Stripe,
    private carts: CartsService,
    private products: ProductsService,
    private socket: SocketGateway,
    private notifications: NotificationsService,
  ) {}

  async checkout(userId: string, dto: CheckoutDto) {
    const buyer = await this.userModel.findById(userId);
    if (!buyer) throw new NotFoundException('User not found');

    const cart = await this.carts.myCart(userId);
    if (!cart.items || cart.items.length === 0)
      throw new NotFoundException('Cart is empty');

    const items = await Promise.all(
      cart.items.map(async (it) => {
        const product = await this.products.findOne(it.productId.toString());
        if (!product) throw new NotFoundException('Product not found');

        return {
          productId: it.productId,
          name: product.name,
          quantity: it.quantity,
          unitPrice: it.priceAtAdd,
          lineTotal: it.priceAtAdd * it.quantity,
        };
      }),
    );

    let subtotal = cart.subtotal;
    const deliveryCharges = cart.deliveryFee ?? 15;
    let discount = 0;
    let total = subtotal - discount + deliveryCharges;

    let loyaltyPointsUsed = 0;
    if (dto.usePoints && buyer.loyaltyPoints > 0) {
      const maxValue = buyer.loyaltyPoints * 0.01;
      const applied = Math.min(maxValue, total);
      loyaltyPointsUsed = Math.round(applied * 100);
      total -= applied;
      buyer.loyaltyPoints -= loyaltyPointsUsed;
    }

    // Add earned points (on successful payment will finalize)
    const pointsEarned = Math.floor(total / 10);

    let paymentIntentId: string | null = null;
    if (dto.paymentInfo?.method === 'card') {
      const intent = await this.stripe.paymentIntents.create({
        amount: Math.round(total * 100),
        currency: 'usd',
        metadata: { userId, pointsEarned },
      });
      paymentIntentId = intent.id;
    } else {
      // If points/cash on delivery
      buyer.loyaltyPoints += pointsEarned;
      await buyer.save();
    }

    const order = await this.model.create({
      userId,
      items,
      addressInfo: dto.addressInfo,
      paymentInfo: dto.paymentInfo || { method: 'points' },
      subtotal,
      discount,
      deliveryCharges,
      loyaltyPointsUsed,
      total,
      status: dto.paymentInfo?.method === 'card' ? 'pending' : 'active',
      paymentIntentId,
    });

    await this.carts.clear(userId);

    return {
      orderId: order._id,
      total,
      clientSecret: paymentIntentId
        ? (await this.stripe.paymentIntents.retrieve(paymentIntentId))
            .client_secret
        : null,
    };
  }

  // backend: orders.service.ts
async createPaymentIntent(orderId: string) {
  const order = await this.model.findById(orderId);
  if (!order) throw new NotFoundException('Order not found');

  const paymentIntent = await this.stripe.paymentIntents.create({
    amount: order.total * 100, // in cents
    currency: 'usd',
    metadata: { orderId },
  });

  return { clientSecret: paymentIntent.client_secret };
}


  async handleStripeWebhook(sig: string, rawBody: Buffer) {
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      throw new ForbiddenException('Invalid Stripe signature');
    }

    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object as Stripe.PaymentIntent;
      const order = await this.model.findOne({
        paymentIntentId: pi.id,
        status: 'pending',
      });
      if (order) {
        const buyer = await this.userModel.findById(order.userId);
        if (buyer) {
          buyer.loyaltyPoints += Number(pi.metadata.pointsEarned ?? 0);
          await buyer.save();
        }
        order.status = OrderStatus.ACTIVE;
        await order.save();

        this.socket.notifyAdmins('orderPlaced', {
          orderId: order._id.toString(),
          userId: order.userId.toString(),
          total: order.total,
        });
        await this.notifications.notifyUser(order.userId.toString(), 'orderPlaced', {
          orderId: order._id.toString(),
          total: order.total,
        });
        this.socket.notifyUser(order.userId.toString(), 'orderPlaced', {
          orderId: order._id.toString(),
          status: order.status,
        });
      }
    }

    return { received: true };
  }
  //update order status
  async markOrderAsPaid(orderId: string) {
  const order = await this.model.findById(orderId);
  if (!order) throw new NotFoundException('Order not found');

  order.status = OrderStatus.ACTIVE;
  order.paymentStatus = 'succeeded';
  // order.paidAt = new Date();

  return order.save();
}


  // === Other utility methods unchanged ===

  listRecent(days = 4) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.model
      .find({ createdAt: { $gte: since } })
      .populate('userId', 'fullName email loyaltyPoints');
  }

  listTotal() {
    return this.model.countDocuments();
  }

  listByProduct(productId: string) {
    return this.model.find({
      'items.productId': new Types.ObjectId(productId),
    });
  }

  listByStatus(status: OrderStatus) {
    return this.model.find({ status });
  }

  async listMine(userId: string) {
    return this.model
      .find({
        $or: [
          { userId: new Types.ObjectId(userId) },
          { userId: userId },
        ],
      })
      .populate('userId', 'fullName email loyaltyPoints');
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    const order = await this.model.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );
    if (order) {
      this.socket.notifyUser(order.userId.toString(), 'orderStatus', {
        orderId: order._id.toString(),
        status,
      });
    }
    return order;
  }
}
