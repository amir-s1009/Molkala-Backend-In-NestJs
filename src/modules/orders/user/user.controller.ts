import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoleGuard, Roles } from '../../../common/gaurds/roleGaurd.js';
import { AuthGuard } from '../../../common/gaurds/authGaurd.js';
import { OrdersUserService } from './user.service.js';
import { CreateOrderDTO } from './user.dto.js';
import { CustomApiOutput, type AuthenticatedRequest } from '../../../types.js';
import { OrderStatus } from '@prisma/client';

@Controller('orders/user')
@UseGuards(AuthGuard, RoleGuard)
@Roles('USER')
export class OrdersUserController {
  constructor(private readonly userService: OrdersUserService) {}

  @Post('createOrder')
  async createOrder(
    @Body() data: CreateOrderDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.userService.createOrder({
      data,
      userId: req.user.userId,
    });
    return new CustomApiOutput({
      message: 'سفارش شما با موفقیت ایجاد شد.',
    });
  }
  @Put('cancelOrder')
  async cancelOrder(@Req() req: AuthenticatedRequest) {
    await this.userService.cancelOrder({ userId: req.user.userId });
    return new CustomApiOutput({
      message: 'سفارش شما با موفقیت لغو گردید.',
    });
  }
  @Get('getAllOrders')
  async getAllOrders(
    @Req() req: AuthenticatedRequest,
    @Query('status') status: OrderStatus | undefined,
  ) {
    return await this.userService.getAllOrders({
      userId: req.user.userId,
      status,
    });
  }
  @Get('getCheckoutDetails')
  async getCheckoutDetails(@Req() req: AuthenticatedRequest) {
    return await this.userService.getCheckoutDetails({
      userId: req.user.userId,
    });
  }
  @Get('isThereUnpaidOrder')
  async isThereUnpaidOrder(@Req() req: AuthenticatedRequest) {
    return await this.userService.isThereUnpaidOrder({
      userId: req.user.userId,
    });
  }
  @Get('getOrdersInformatics')
  async getOrdersInformatics(@Req() req: AuthenticatedRequest) {
    return await this.userService.getOrdersInformatics({
      userId: req.user.userId,
    });
  }
}
