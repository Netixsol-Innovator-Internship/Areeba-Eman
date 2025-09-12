import { Body, Controller, Get, Post, Query, UseGuards, Req, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CheckoutDto } from './dto/checkout.dto';
import { OrderStatus } from './schemas/order.schema';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('checkout')
async checkout(@Req() req, @Body() body: CheckoutDto) {
  console.log('req.user:', req.user);
  return this.orders.checkout(req.user.sub, body);
}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('mine')
  mine(@Req() req: any) {
    return this.orders.listMine(req.user.sub);
  }

  @Get('recent')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  recent(@Query('days') days?: string, @Query('status') status?: OrderStatus) {
    if (status) return this.orders.listByStatus(status);
    return this.orders.listRecent(Number(days || 4));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get('total')
  total() {
    return this.orders.listTotal();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get('by-product/:productId')
  byProduct(@Param('productId') pid: string) {
    return this.orders.listByProduct(pid);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get('status/:status')
  byStatus(@Param('status') s: OrderStatus) {
    return this.orders.listByStatus(s);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Patch(':orderId/status/:status')
  setStatus(@Param('orderId') id: string, @Param('status') s: OrderStatus) {
    return this.orders.updateStatus(id, s);
  }
}
