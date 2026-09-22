import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_KEY,
      signOptions: {
        expiresIn: '1h',
        algorithm: 'HS256',
      },
    }),
  ],
  exports: [JwtModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
