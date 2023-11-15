import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.loginUser(loginDto);
  }

  @Post('signup')
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signUpUser(signUpDto);
  }
}
