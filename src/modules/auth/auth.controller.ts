import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { loginUserDTOReq, SignupUserDTOReq } from './web.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: loginUserDTOReq) {
    return await this.authService.login(body);
  }

  @Post('signup')
  async signup(@Body() body: SignupUserDTOReq) {
    return await this.authService.signup(body);
  }
}
