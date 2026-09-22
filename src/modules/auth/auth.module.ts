import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

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
})
export class AuthModule {}
