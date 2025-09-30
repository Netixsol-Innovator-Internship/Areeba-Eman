import { Controller, Get, Req, UseGuards, NotFoundException } from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtAuthGuard } from 'src/guards/jwt.guard'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    const user = await this.usersService.findByEmail(req.user.email)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      chatId: user.chatId,
    }
}

}
