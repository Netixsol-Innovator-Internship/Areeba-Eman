import { Body, Controller, Get, Param, Post, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
@ApiTags('ratings') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('ratings')
export class RatingsController {
  constructor(private ratings: RatingsService) {}
  @Post(':productId') add(@Param('productId') pid: string, @Body() body: any, @Req() req: any) {
    const userId = req.user.sub; return this.ratings.add(pid, userId, Number(body.stars), body.comment || ''); }
  @Get(':productId/average') avg(@Param('productId') pid: string) { return this.ratings.average(pid); }
}
