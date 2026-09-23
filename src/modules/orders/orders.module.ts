import { Module } from '@nestjs/common';
import { OrdersUserController } from './user/user.controller.js';
import { OrdersUserService } from './user/user.service.js';
import { OrdersAdminService } from './admin/admin.service.js';
import { OrdersAdminController } from './admin/admin.controller.js';
import OrderDomain from './order.domain.js';
import { AuthModule } from '../auth/auth.module.js';
import { ReservationsModule } from '../reservations/reservations.module.js';
import { ProductsModule } from '../products/products.module.js';

@Module({
  imports: [AuthModule, ProductsModule, ReservationsModule],
  controllers: [OrdersUserController, OrdersAdminController],
  providers: [OrdersUserService, OrdersAdminService, OrderDomain],
})
export class OrdersModule {}
