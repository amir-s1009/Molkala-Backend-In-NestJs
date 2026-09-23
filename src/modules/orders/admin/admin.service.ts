import { Injectable } from '@nestjs/common';
import { prisma } from '../../../db/prisma.js';
import { BadRequestError, NotFoundError } from '../../../errors.js';
import { OrderStatus } from '@prisma/client';
import {
  OrderAdminInformaticsDTO,
  OrderAdminListItemDTO,
} from './admin.dto.js';
import OrderDomain from '../order.domain.js';

@Injectable()
export class OrdersAdminService {
  constructor(private orderDomain: OrderDomain) {}

  async shipOrder(id: string) {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        transaction: true,
      },
    });
    if (!order) throw new NotFoundError('چنین سفارشی در سیستم یافت نشد.');

    if (order.status !== 'PROCESSING' || !order.transaction)
      throw new BadRequestError(
        "با توجه به وضعیت کنونی سفارش مورد نظر، امکان تغییر وضعیت آن به عنوان 'ارسال شده' میسر نیست.",
      );

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: 'SHIPPED',
        shippedAt: new Date(),
      },
    });
  }

  async deliverOrder(id: string) {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
    });
    if (!order) throw new NotFoundError('چنین سفارشی در سیستم یافت نشد.');

    if (order.status !== 'SHIPPED')
      throw new BadRequestError(
        "با توجه به وضعیت کنونی سفارش مورد نظر، امکان تغییر وضعیت آن به عنوان 'تحویل شده' میسر نیست.",
      );

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: 'DELIVERED',
        deliveredAt: new Date(),
      },
    });
  }

  async getAllOrders(status?: OrderStatus): Promise<OrderAdminListItemDTO[]> {
    const orders = await prisma.order.findMany({
      where: {
        status,
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

  async getOrdersInformatics(): Promise<OrderAdminInformaticsDTO> {
    const allOrders = await prisma.order.findMany({
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
