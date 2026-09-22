import { Injectable } from '@nestjs/common';
import { CartItemsListItemDTO } from './user.dto.js';
import { prisma } from '../../../../db/prisma.js';
import { BadRequestError, NotFoundError } from '../../../errors.js';

@Injectable()
export class UserService {
  async getCartItems({
    userId,
  }: {
    userId: string;
  }): Promise<CartItemsListItemDTO[]> {
    const userCartItems = await prisma.cartItem.findMany({
      where: {
        cart: {
          userId,
        },
      },
      select: {
        id: true,
        qty: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            category: {
              select: {
                name: true,
              },
            },
            poster: true,
          },
        },
      },
    });

    return userCartItems.map((i) => ({
      id: i.id,
      qty: i.qty,
      product: {
        id: i.product.id,
        name: i.product.name,
        category: i.product.category?.name ?? null,
        price: i.product.price,
        poster: i.product.poster?.base64 ?? null,
      },
    }));
  }

  async userCreateCartItem({
    productId,
    userId,
  }: {
    productId: string;
    userId: string;
  }) {
    await prisma.$transaction(async (tx) => {
      // await tx.$queryRaw`
      //   SELECT 1
      //   FROM "Product"
      //   WHERE id = ${productId}
      //   FOR UPDATE
      // `;
      // await tx.$queryRaw`
      //   SELECT 1
      //   FROM "StockReservation"
      //   WHERE productId = ${productId} and status = "ACTIVE"
      //   FOR UPDATE
      // `;
      const product = await tx.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          reservations: {
            where: {
              status: 'ACTIVE',
            },
          },
        },
      });
      if (!product) {
        throw new NotFoundError('محصول مورد نظر یافت نشد.');
      }
      // const activeReservationsCount =
      //   ReservationDomain.calcTotalActiveReservations(product.reservations);
      // const reservableCapacity = ReservationDomain.getReservableCapacity(
      //   product.stock,
      //   activeReservationsCount
      // );
      // if (!ReservationDomain.isReservable(1, reservableCapacity))
      //   return {
      //     ok: false,
      //     code: 400,
      //     message:
      //       "تعداد موجودی محصول در انبار، برای افزودن به سبد شما هم اکنون کافی نمی باشد",
      //   };

      const userCart = await tx.cart.findUnique({
        where: {
          userId,
        },
      });

      if (userCart) {
        if (userCart.isFreezed)
          throw new BadRequestError(
            'سبد شما جهت تکمیل سفارش در جریان شما منجمد شده است.',
          );

        const productInCartAlready = await tx.cartItem.findFirst({
          where: {
            cart: {
              id: userCart.id,
            },
            productId,
          },
        });

        if (productInCartAlready)
          throw new BadRequestError('محصول در سبد خرید شما موجود است.');

        await tx.cartItem.create({
          data: {
            cartId: userCart.id,
            productId,
            qty: 1,
          },
        });
      } else {
        await tx.cart.create({
          data: {
            userId,
            cartItems: {
              create: {
                productId,
                qty: 1,
              },
            },
          },
        });
      }
    });
  }
}
