import { TransactionStatus } from "@prisma/client";

export type TransactionUserListItemDTO = {
  id: string;
  amount: number;
  gatewayReference: string | null;
  status: TransactionStatus;
  createdAt: Date;
  successfulAt: Date | null;
  failedAt: Date | null;
  expiredAt: Date | null;
  refundedAt: Date | null;
};

export type PaymentResultDTO = {
  status: TransactionStatus;
  amount: number;
  gatewayReference: string;
  createdAt: Date;
  successfulAt: Date | null;
  failedAt: Date | null;
  expiredAt: Date | null;
  refundedAt: Date | null;
};

export type TransactionUserInformaticsDTO = {
  count: {
    total: number;
    pending: number;
    successful: number;
    failed: number;
    expired: number;
  };
};
