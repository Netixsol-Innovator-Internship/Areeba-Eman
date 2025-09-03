import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwt: JwtService) {}

  async signup(data: SignupDto) {
    console.log('Signup data:', data);
  const existing = await this.usersService.findByUsername(data.username);
  if (existing) throw new ConflictException('Username taken');

  const hash = await bcrypt.hash(data.password, 10);

  const user = await this.usersService.create({
    ...data,
    password: hash,
  });

  return { message: 'User created', userId: user._id };
}

  async login(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user._id, username: user.username };
    return { access_token: this.jwt.sign(payload) };
  }
}
