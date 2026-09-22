import { TransactionStatus } from '@prisma/client';

export type TransactionAdminListItemDTO = {
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

export type TransactionAdminInformaticsDTO = {
  count: {
    total: number;
    pending: number;
    successful: number;
    failed: number;
    expired: number;
  };
};
