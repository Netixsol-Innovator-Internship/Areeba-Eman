import { Body, Controller, Get, Param, Post, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateRatingDto } from './dto/create-rating.dto';

@ApiTags('ratings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ratings')
export class RatingsController {
  constructor(private ratings: RatingsService) {}

  @Post(':productId')
  @ApiBody({
  type: CreateRatingDto,
  description: 'Add a rating to a product',
  })
  add(
    @Param('productId') pid: string,
    @Body() body: CreateRatingDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return this.ratings.add(pid, userId, body.stars, body.comment || '');
  }

  @Get(':productId/average')
  avg(@Param('productId') pid: string) {
    return this.ratings.average(pid);
  }
}
