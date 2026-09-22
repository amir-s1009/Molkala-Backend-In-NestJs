import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartsUserService } from './user.service.js';
import { AuthGuard } from '../../../common/gaurds/authGaurd.js';
import { RoleGuard, Roles } from '../../../common/gaurds/roleGaurd.js';
import type { AuthenticatedRequest } from '../../../types.js';
import { CustomApiOutput } from '../../../types.js';
import { UpdateCartItemQtyDTO } from './user.dto.js';

@Controller('carts/user')
@UseGuards(AuthGuard, RoleGuard)
@Roles('USER')
export class CartsUserController {
  constructor(private readonly userService: CartsUserService) {}

  @Get('getCartItems')
  async getCartItems(@Req() req: AuthenticatedRequest) {
    return await this.userService.getCartItems({ userId: req.user.userId });
  }

  @Post('createCartItem/:productId')
  async createCartItem(
    @Req() req: AuthenticatedRequest,
    @Param('productId') productId: string,
  ) {
    await this.userService.createCartItem({
      userId: req.user.userId,
      productId,
    });

    return new CustomApiOutput({
      message: 'محصول به سبد خرید شما افزوده شد.',
    });
  }

  @Delete('deleteCartItem/:id')
  async deleteCartItem(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    await this.userService.deleteCartItem({
      userId: req.user.userId,
      id,
    });

    return new CustomApiOutput({
      message: 'محصول از سبد خرید شما حذف شد.',
    });
  }

  @Put('changeCartItemQty/:id')
  async updateCartItemQty(
    @Req() req: AuthenticatedRequest,
    @Body() body: UpdateCartItemQtyDTO,
    @Param('id') id: string,
  ) {
    await this.userService.changeCartItemQty({
      userId: req.user.userId,
      id,
      newQty: body.qty,
    });

    return new CustomApiOutput({
      message: 'تعداد مصحول در سبد خرید شما تغییر پیدا کرد.',
    });
  }
}
