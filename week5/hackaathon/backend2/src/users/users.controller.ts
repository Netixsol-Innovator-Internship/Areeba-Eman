import { Controller, Get, Patch, Body, UseGuards, Post, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  profile(@GetUser('sub') userId: string) {
    return this.usersService.findById(userId);
  }

  @Patch('profile')
  updateProfile(@GetUser('sub') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Post('wishlist/:carId')
  addWishlist(@GetUser('sub') userId: string, @Param('carId') carId: string) {
    return this.usersService.addToWishlist(userId, carId);
  }

  @Delete('wishlist/:carId')
  removeWishlist(@GetUser('sub') userId: string, @Param('carId') carId: string) {
    return this.usersService.removeFromWishlist(userId, carId);
  }
}
