import { Module } from '@nestjs/common';
import { CartsUserController } from './user/user.controller.js';
import { CartsUserService } from './user/user.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  exports: [],
  providers: [CartsUserService],
  controllers: [CartsUserController],
})
export class CartsModule {}
