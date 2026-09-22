import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnAuthorizedError } from '../../errors.js';
import { JWT } from '../../modules/auth/auth.domain.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnAuthorizedError('برای ادامه عملیات بایستی وارد سیستم شوید.');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JWT>(token);

      request.user = payload;

      return true;
    } catch {
      throw new UnAuthorizedError('توکن شما نا معتبر و یا منقضی شده است.');
    }
  }
}
