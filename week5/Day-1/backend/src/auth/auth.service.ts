import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { User } from './user.interface';

@Injectable()
export class AuthService {
  // In-memory store
  public users: User[] = [];

  signup(username: string, password: string): User {
    if (!username || !password) throw new BadRequestException('Missing fields');
    if (username.length < 3) throw new BadRequestException('Username too short');
    if (password.length < 6) throw new BadRequestException('Password too short');
    if (this.users.find(u => u.username === username)) {
      throw new BadRequestException('User already exists');
    }
    const user: User = { username, password, unread: [] };
    this.users.push(user);
    return user;
  }

  login(username: string, password: string): User {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  find(username: string) {
    return this.users.find(u => u.username === username);
  }
}
