import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';;

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

 @Post('signup')
async signup(@Body() signupDto: SignupDto) {
  return this.auth.signup(signupDto);
}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.username, dto.password);
  }
}
