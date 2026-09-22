import { OrderStatus } from '@prisma/client';

export default class OrderDomain {
  static calculateItemsTotalAmount(
    items: { price: number; qty: number }[],
  ): number {
    return items.reduce(
      (prev, current) => prev + current.price * current.qty,
      0,
    );
  }

  static countOrdersByStatus(
    orders: { status: OrderStatus }[],
    countableStatus: OrderStatus[],
  ): number {
    return orders.reduce((prev, current) => {
      if (countableStatus.find((s) => s === current.status)) return prev + 1;
      return prev;
    }, 0);
  }
}
