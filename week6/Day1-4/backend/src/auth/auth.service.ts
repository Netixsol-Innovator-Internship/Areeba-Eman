import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}
  async signup(dto: CreateUserDto) { return this.users.create(dto); }
  async verify(email: string, code: string) { return this.users.verifyOtp(email, code); }
  async resend(email: string) { return this.users.resendOtp(email); }
  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    if (!user.verified) throw new BadRequestException('Please verify your email before logging in');
    const payload = { sub: user._id.toString(), email: user.email, roles: user.roles, fullName: user.fullName };
    const access_token = await this.jwt.signAsync(payload, { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES || '7d' });
    return { access_token };
  }
  async profile(user: any) { const { sub, email, roles, fullName } = user; return { id: sub, email, roles, fullName }; }
  async requestReset(email: string) { return this.users.setResetOtp(email); }
  async performReset(email: string, code: string, newPassword: string) { return this.users.resetPassword(email, code, newPassword); }
}
