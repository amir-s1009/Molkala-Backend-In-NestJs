import { OrderStatus } from "@prisma/client";

export type CreateOrderDTO = {
  address: {
    province: string;
    city: string;
    route: string;
  };
};

export type OrderCheckoutDetailsDTO = {
  orderId: string;
  items: {
    id:string;
    name: string;
    qty: number;
    unitPrice: number;
  }[];
  totalAmount: number;
  address: {
    province: string;
    city: string;
    route: string;
  };
};

export type OrderUserListItemDTO = {
  id: string;
  status: OrderStatus;
  createdAt: Date;
  paymentBrokenAt: Date | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  canceledAt: Date | null;
  expiredAt: Date | null;
  items: {
    id:string;
    name: string;
    qty: number;
    unitPrice: number;
  }[];
  totalAmount: number;
  address: {
    province: string;
    city: string;
    route: string;
  };
};

export type OrderUserInformaticsDTO = {
  count: {
    totalOrders: number;
    deliveredOrders: number;
    onShipOrders: number;
    pendingOrders: number;
  };
};
