import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller.js';
import { UserService } from './user/user.service.js';
import { AdminService } from './admin/admin.service.js';
import { AdminController } from './admin/admin.controller.js';

@Module({
  controllers: [UserController, AdminController],
  providers: [UserService, AdminService]
})
export class OrdersModule {}
