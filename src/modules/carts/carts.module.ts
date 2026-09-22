import { Module } from '@nestjs/common';
import { CartsUserController } from './user/user.controller.js';
import { CartsUserService } from './user/user.service.js';

@Module({
  imports: [],
  exports: [],
  providers: [CartsUserService],
  controllers: [CartsUserController],
})
export class CartsModule {}
