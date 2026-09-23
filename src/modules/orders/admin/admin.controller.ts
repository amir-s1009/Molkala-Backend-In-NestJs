import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../common/gaurds/authGaurd.js';
import { RoleGuard, Roles } from '../../../common/gaurds/roleGaurd.js';
import { OrdersAdminService } from './admin.service.js';
import { CustomApiOutput } from '../../../types.js';

@Controller('orders/admin')
@UseGuards(AuthGuard, RoleGuard)
@Roles('ADMIN')
export class OrdersAdminController {
  constructor(private readonly adminService: OrdersAdminService) {}

  @Put('shipOrder/:id')
  async shipOrder(@Param('id') id: string) {
    await this.adminService.shipOrder(id);
    return new CustomApiOutput({
      message: 'سفارش مورد نظر با موفقیت در وضعیت ارسال شده قرار گرفت.',
    });
  }
  @Put('deliverOrder/:id')
  async deliverOrder(@Param('id') id: string) {
    await this.adminService.deliverOrder(id);
    return new CustomApiOutput({
      message: 'سفارش مورد نظر با موفقیت در وضعیت تحویل شده قرار گرفت.',
    });
  }
  @Get('getAllOrders')
  async getAllOrders() {
    return await this.adminService.getAllOrders();
  }
  @Get('getOrdersInformatics')
  async getOrdersInformatics() {
    return await this.adminService.getOrdersInformatics();
  }
}
