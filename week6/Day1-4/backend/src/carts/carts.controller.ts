import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CartsService } from './carts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
@ApiTags('carts') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('carts')
export class CartsController {
  constructor(private carts: CartsService) {}
  @Get('mine') mine(@Req() req: any) { return this.carts.myCart(req.user.sub); }
  @Post(':productId') add(@Param('productId') productId: string, @Req() req: any) { return this.carts.add(req.user.sub, productId, 1); }
  @Delete(':productId') remove(@Param('productId') productId: string, @Req() req: any) { return this.carts.remove(req.user.sub, productId); }
  @Patch(':productId/qty/:qty') changeQty(@Param('productId') productId: string, @Param('qty') qty: string, @Req() req: any) { return this.carts.changeQty(req.user.sub, productId, Number(qty)); }
}
