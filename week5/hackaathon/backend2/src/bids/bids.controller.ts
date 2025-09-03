import { Body, Controller, Get, Post, UseGuards, Param } from '@nestjs/common';
import { BidsService } from './bids.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { CreateBidDto } from './dto/create-bid.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// @ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bids')
export class BidsController {
  constructor(private bids: BidsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  place(@GetUser('sub') userId: string, @Body() dto: CreateBidDto) {
    return this.bids.placeBid(userId, dto.carId, dto.amount);
  }

 @Get('car/:carId')
getForCar(@Param('carId') carId: string) {
  return this.bids.getBidsForCar(carId);
}
}
