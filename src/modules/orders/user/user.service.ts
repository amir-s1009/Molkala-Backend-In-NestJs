import { Injectable } from '@nestjs/common';
import {
  CreateOrderDTO,
  OrderCheckoutDetailsDTO,
  OrderUserInformaticsDTO,
  OrderUserListItemDTO,
} from './user.dto.js';
import { prisma } from '../../../db/prisma.js';
import { BadRequestError, NotFoundError } from '../../../errors.js';
import ProductDomain from '../../products/product.domain.js';
import { OrderStatus, Prisma } from '@prisma/client';
import ReservationDomain from '../../reservations/reservation.domain.js';
import OrderDomain from '../order.domain.js';

@Injectable()
export class OrdersUserService {
  constructor(
    private readonly productDomain: ProductDomain,
    private readonly orderDomain: OrderDomain,
    private readonly reservationDomain: ReservationDomain,
  ) {}

  async createOrder({
    data,
    userId,
  }: {
    data: CreateOrderDTO;
    userId: string;
  }): Promise<{ hasUnpaidOrder: true } | undefined> {
    const paymentPendingOrder = await prisma.order.findFirst({
      where: {
        userId,
        transaction: null,
        status: 'PAYMENT_PENDING',
      },
    });

    if (paymentPendingOrder)
      return {
        hasUnpaidOrder: true,
      };

    const userCart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        cartItems: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!userCart || userCart.cartItems.length === 0)
      throw new BadRequestError('شما سبد خریدی برای تسویه ندارید.');

    await prisma.$transaction(async (tx) => {
      const sortedProductIds = this.productDomain.sortIds(
        userCart.cartItems.map((ci) => ci.productId),
      );
      await tx.$queryRaw`
            SELECT 1
            FROM "Product"
            WHERE id IN (${Prisma.join(sortedProductIds)})
            FOR UPDATE
          `;
      await tx.$queryRaw`
            SELECT 1
            FROM "StockReservation"
            WHERE "productId" IN (${Prisma.join(sortedProductIds)})
              AND status = 'ACTIVE'
            FOR UPDATE
          `;

      for (const ci of userCart.cartItems) {
        const itemProduct = await tx.product.findUnique({
          where: {
            id: ci.productId,
          },
          include: {
            reservations: {
              where: {
                status: 'ACTIVE',
              },
            },
          },
        });
        if (!itemProduct) {
          throw new NotFoundError('محصول مرتبط با سبد خرید شما یافت نشد.');
        }
        const activeReservationsCount =
          this.reservationDomain.calcTotalActiveReservations(
            itemProduct.reservations,
          );
        const reservableCapacity = this.reservationDomain.getReservableCapacity(
          itemProduct.stock,
          activeReservationsCount,
        );

        if (!this.reservationDomain.isReservable(ci.qty, reservableCapacity))
          throw new BadRequestError(
            'تعداد موجودی قابل رزرو محصول برای سفارش شما هم اکنون کافی نمی باشد',
          );
      }

      const orderCreated = await tx.order.create({
        data: {
          userId,
          address: {
            create: {
              province: data.address.province,
              city: data.address.city,
              route: data.address.route,
            },
          },
          items: {
            createMany: {
              data: userCart.cartItems.map((ci) => ({
                name: ci.product.name,
                price: ci.product.price,
                qty: ci.qty,
              })),
            },
          },
        },
      });
      for (const ci of userCart.cartItems) {
        await tx.stockReservation.create({
          data: {
            qty: ci.qty,
            productId: ci.productId,
            orderId: orderCreated.id,
            status: 'ACTIVE',
            expiredAt: this.reservationDomain.reIssueExpireAt(),
          },
        });
      }
      await tx.cart.update({
        where: {
          userId,
        },
        data: {
          isFreezed: true,
        },
      });
    });
  }

  async isThereUnpaidOrder({ userId }: { userId: string }): Promise<{
    hasUnpaidOrder: boolean;
  }> {
    const paymentPendingOrder = await prisma.order.findFirst({
      where: {
        userId,
        transaction: null,
        status: 'PAYMENT_PENDING',
      },
    });

    return {
      hasUnpaidOrder: !!paymentPendingOrder,
    };
  }

  async cancelOrder({ userId }: { userId: string }) {
    const paymentPendingOrder = await prisma.order.findFirst({
      where: {
        userId,
        transaction: null,
        status: 'PAYMENT_PENDING',
      },
    });

    if (!paymentPendingOrder)
      throw new NotFoundError('هیچ سفارش در جریانی برای لغو ندارید.');

    await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`
        SELECT 1
        FROM "Order"
        WHERE id = ${paymentPendingOrder.id}
        FOR UPDATE
      `;
      await tx.$queryRaw`
        SELECT 1
        FROM "StockReservation"
        WHERE orderId = ${paymentPendingOrder.id}
        FOR UPDATE
      `;

      const order = await tx.order.findUnique({
        where: {
          id: paymentPendingOrder.id,
        },
        include: {
          reservations: true,
        },
      });

      const expiredReservation = this.reservationDomain.findExpiredReservation(
        order!.reservations,
      );
      if (expiredReservation) {
        throw new BadRequestError('سفارش  شما قبلا منقضی شده است.');
      }

      await tx.order.update({
        where: {
          id: order!.id,
        },
        data: {
          status: 'CANCELED',
        },
      });

      await tx.stockReservation.updateMany({
        where: {
          orderId: order!.id,
        },
        data: {
          status: 'CANCELED',
        },
      });

      await prisma.cart.update({
        where: {
          userId,
        },
        data: {
          isFreezed: false,
        },
      });
    });
  }

  async getCheckoutDetails({
    userId,
  }: {
    userId: string;
  }): Promise<OrderCheckoutDetailsDTO> {
    const order = await prisma.order.findFirst({
      where: {
        userId,
        transaction: null,
      },
      select: {
        id: true,
        address: {
          select: {
            province: true,
            city: true,
            route: true,
          },
        },
        items: {
          select: {
            id: true,
            name: true,
            qty: true,
            price: true,
          },
        },
      },
    });

    if (!order) throw new NotFoundError('سفارش در جریانی ندارید.');

    const totalAmount = this.orderDomain.calculateItemsTotalAmount(order.items);

    return {
      orderId: order.id,
      address: order.address!,
      items: order.items.map((i) => ({
        id: i.id,
        name: i.name,
        qty: i.qty,
        unitPrice: i.price,
      })),
      totalAmount,
    };
  }

  async getAllOrders({
    userId,
    status,
  }: {
    status?: OrderStatus;
    userId: string;
  }): Promise<OrderUserListItemDTO[]> {
    const orders = await prisma.order.findMany({
      where: {
        status,
        userId,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        paymentBrokenAt: true,
        shippedAt: true,
        deliveredAt: true,
        address: true,
        canceledAt: true,
        expiredAt: true,
        items: {
          select: {
            id: true,
            name: true,
            qty: true,
            price: true,
          },
        },
      },
    });

    return orders.map((order) => ({
      id: order.id,
      status: order.status,
      createdAt: order.createdAt,
      paymentBrokenAt: order.paymentBrokenAt,
      canceledAt: order.canceledAt,
      expiredAt: order.expiredAt,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
      address: order.address!,
      totalAmount: this.orderDomain.calculateItemsTotalAmount(order.items),
      items: order.items.map((item) => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        unitPrice: item.price,
      })),
    }));
  }

  async getOrdersInformatics({
    userId,
  }: {
    userId: string;
  }): Promise<OrderUserInformaticsDTO> {
    const allOrders = await prisma.order.findMany({
      where: {
        userId,
      },
      select: {
        status: true,
      },
    });

    const deliveredCount = this.orderDomain.countOrdersByStatus(allOrders, [
      'DELIVERED',
    ]);
    const shippedCount = this.orderDomain.countOrdersByStatus(allOrders, [
      'SHIPPED',
    ]);
    const pendingCount = this.orderDomain.countOrdersByStatus(allOrders, [
      'PAYMENT_PENDING',
      'PROCESSING',
    ]);

    return {
      count: {
        totalOrders: allOrders.length,
        deliveredOrders: deliveredCount,
        onShipOrders: shippedCount,
        pendingOrders: pendingCount,
      },
    };
  }
}
