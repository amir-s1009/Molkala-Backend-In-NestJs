import { Module } from '@nestjs/common';
import { UserService } from './user/user.service.js';
import { UserController } from './user/user.controller.js';

@Module({
  imports: [],
  exports: [],
  providers: [UserService],
  controllers: [UserController],
})
export class CartsModule {}