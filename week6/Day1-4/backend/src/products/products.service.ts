import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { NotificationsService } from '../notifications/notifications.service';
@Injectable()
export class ProductsService {
  private LOW_STOCK_THRESHOLD = Number(process.env.LOW_STOCK_THRESHOLD || 5);
  constructor(@InjectModel(Product.name) private model: Model<ProductDocument>, private notifications: NotificationsService) {}
  create(dto: CreateProductDto) { return this.model.create(dto); }
  async update(id: string, dto: Partial<CreateProductDto>) {
    const p = await this.model.findByIdAndUpdate(id, dto, { new: true }); if (!p) throw new NotFoundException('Product not found'); return p;
  }
  async remove(id: string) { const p = await this.model.findByIdAndDelete(id); if (!p) throw new NotFoundException('Product not found'); return { message: 'Deleted' }; }
  async findAll(query: any) {
    const filter: any = {};
    if (query.types) filter.types = query.types;
    if (query.category) filter.category = query.category;
    if (query.style) filter.style = query.style;
    if (query.size) filter.size = query.size;
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }
    if (query.q) filter.$or = [{ name: { $regex: query.q, $options: 'i' } }];
    const items = await this.model.find(filter);
    if (query.color) {
      const color = query.color.toString().toLowerCase();
      return items.filter(i => Array.from((i.imagesByColor || new Map()).keys()).map(k => k.toLowerCase()).includes(color));
    }
    return items;
  }
  findOne(id: string) { return this.model.findById(id); }
  async attachImages(id: string, color: string, urls: string[]) {
    const p = await this.model.findById(id);
    if (!p) throw new NotFoundException('Product not found');
    const current = p.imagesByColor?.get(color) || [];
    p.imagesByColor.set(color, [...current, ...urls]);
    await p.save();
    return p;
  }
  async adjustStockOnOrder(id: string, qty: number) {
    const p = await this.model.findById(id);
    if (!p) throw new NotFoundException('Product not found');
    if (p.stockQuantity < qty) throw new NotFoundException('Out of stock');
    p.stockQuantity -= qty;
    p.sales += qty;
    await p.save();
    try {
      if (p.stockQuantity <= 0) {
        await this.notifications.notifyAdmins('productOutOfStock', { productId: p._id.toString(), name: p.name });
      } else if (p.stockQuantity <= this.LOW_STOCK_THRESHOLD) {
        await this.notifications.notifyAdmins('productLowStock', { productId: p._id.toString(), name: p.name, stock: p.stockQuantity });
      }
    } catch (e) {}
    return p;
  }
  async updateSale(
  id: string,
  body: { sale: boolean; discount?: number; saleEnd?: Date }
) {
  return this.model.findByIdAndUpdate(
    id,
    {
      sale: body.sale,
      discount: body.discount ?? 0,
      saleEnd: body.saleEnd ?? null,
    },
    { new: true }
  );
}
  async setAverageRating(id: string, avg: number) { await this.model.findByIdAndUpdate(id, { averageRating: avg }); }
}
