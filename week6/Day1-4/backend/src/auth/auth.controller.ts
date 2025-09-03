import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RequestResetDto, PerformResetDto } from './dto/reset.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
@ApiTags('auth') @Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Post('signup') signup(@Body() dto: CreateUserDto) { return this.auth.signup(dto); }
  @Post('verify') verify(@Body() dto: VerifyOtpDto) { return this.auth.verify(dto.email, dto.code); }
  @Post('resend-otp') resend(@Body('email') email: string) { return this.auth.resend(email); }
  @Post('login') login(@Body() dto: LoginDto) { return this.auth.login(dto.email, dto.password); }
  @Post('forgot-password') forgot(@Body() dto: RequestResetDto) { return this.auth.requestReset(dto.email); }
  @Post('reset-password') reset(@Body() dto: PerformResetDto) { return this.auth.performReset(dto.email, dto.code, dto.newPassword); }
  @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Get('profile') me(@Req() req: any) { return this.auth.profile(req.user); }
}
