import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
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

  

// orders.service.ts
async checkout(userId: string, dto: CheckoutDto) {
  const buyer = await this.userModel.findById(userId);
  if (!buyer) throw new NotFoundException('User not found');

  // 1. Get cart
  const cart = await this.carts.myCart(userId);
  if (!cart.items || cart.items.length === 0) {
    throw new NotFoundException('Cart is empty');
  }

  // 2. Build order items
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
  })
);


  let subtotal = cart.subtotal;
  const deliveryCharges = cart.deliveryFee;
  let discount = 0; // can apply first order discount logic here
  let total = subtotal - discount + deliveryCharges;

  // 3. Loyalty points usage
  let loyaltyPointsUsed = 0;
  if (dto.usePoints && buyer.loyaltyPoints > 0) {
    const maxValue = buyer.loyaltyPoints * 0.01; // 1 point = 1 cent
    const applied = Math.min(maxValue, total);
    loyaltyPointsUsed = Math.round(applied * 100); // convert back to points
    total -= applied;
    buyer.loyaltyPoints -= loyaltyPointsUsed;
  }

  // 4. Earn new points (e.g. 1 point per 10 currency)
  buyer.loyaltyPoints += Math.floor(total / 10);
  await buyer.save();

  // 5. Stripe payment intent (if card)
  let paymentIntentId: string | null = null;
  if (dto.paymentInfo?.method === 'card') {
    const intent = await this.stripe.paymentIntents.create({
      amount: Math.round(total * 100), // convert to cents
      currency: 'usd',
      metadata: { userId },
    });
    paymentIntentId = intent.id;
  }

  // 6. Create order
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
    status: 'active',
    paymentIntentId,
  });

  // 7. Clear cart
  await this.carts.clear(userId);

  return {
    orderId: order._id,
    total,
    clientSecret: paymentIntentId ? (await this.stripe.paymentIntents.retrieve(paymentIntentId)).client_secret : null,
  };
}




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
    return this.model.find({ 'items.productId': new Types.ObjectId(productId) });
  }

  async listMine(userId: string) {
    console.log("userId:",userId)
    try{
const result = await this.model
    .find({
  $or: [
    { userId: new Types.ObjectId(userId) },
    { userId: userId } // handle legacy string userIds
  ]
}).populate('userId', 'fullName email loyaltyPoints');
    console.log("result:",result)
    return result;
    } catch(err){
      console.log("err:",err)
    }
   
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

async confirmPayment(user: any, paymentIntentId: string, addressInfo: any) {
  const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== 'succeeded')
    throw new BadRequestException('Payment not confirmed');

  // 🛒 Rebuild items from cart
  const cart = await this.carts.myCart(user.sub);
  const buyer = await this.userModel.findById(user.sub);
  if (!buyer) throw new NotFoundException('User not found');

  let subtotal = 0;
  const items: any[] = [];

  for (const it of cart.items) {
    const product = await this.products.findOne(it.productId.toString());
    if (!product) throw new NotFoundException('Product not found');

    await this.products.adjustStockOnOrder(product._id.toString(), it.quantity);

    const price = product.sale && product.discount > 0
      ? parseFloat((product.price * (1 - product.discount / 100)).toFixed(2))
      : product.price;

    buyer.loyaltyPoints += product.loyaltyPoints * it.quantity;

    items.push({
      productId: new Types.ObjectId(product._id),
      name: product.name,
      unitPrice: price,
      quantity: it.quantity,
      lineTotal: price * it.quantity,
    });

    subtotal += price * it.quantity;
  }

  await buyer.save();

  let discount = 0;
  const firstOrder = await this.model.countDocuments({ userId: user.sub });
  if (firstOrder === 0) discount = subtotal * 0.2;

  const deliveryCharges = 15;
  const total = subtotal - discount + deliveryCharges;

  const order = await this.model.create({
    userId: new Types.ObjectId(user.sub),
    items,
    addressInfo,
    paymentInfo: { method: 'card', stripePaymentId: paymentIntent.id },
    subtotal,
    discount,
    deliveryCharges,
    total,
  });

  await this.carts.clear(user.sub);

  this.socket.notifyAdmins('orderPlaced', { orderId: order._id.toString(), userId: user.sub, total });
  await this.notifications.notifyUser(user.sub, 'orderPlaced', { orderId: order._id.toString(), total });
  this.socket.notifyUser(order.userId.toString(), 'orderPlaced', { orderId: order._id.toString(), status: order.status });

  return order;
}



}
