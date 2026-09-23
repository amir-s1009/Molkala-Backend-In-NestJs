import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller.js';
import { UserService } from './user/user.service.js';
import { OrdersAdminService } from './admin/admin.service.js';
import { OrdersAdminController } from './admin/admin.controller.js';
import OrderDomain from './order.domain.js';

@Module({
  controllers: [UserController, OrdersAdminController],
  providers: [UserService, OrdersAdminService, OrderDomain],
})
export class OrdersModule {}
