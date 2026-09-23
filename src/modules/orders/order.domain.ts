import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';

@Injectable()
export default class OrderDomain {
  calculateItemsTotalAmount(items: { price: number; qty: number }[]): number {
    return items.reduce(
      (prev, current) => prev + current.price * current.qty,
      0,
    );
  }

  countOrdersByStatus(
    orders: { status: OrderStatus }[],
    countableStatus: OrderStatus[],
  ): number {
    return orders.reduce((prev, current) => {
      if (countableStatus.find((s) => s === current.status)) return prev + 1;
      return prev;
    }, 0);
  }
}
