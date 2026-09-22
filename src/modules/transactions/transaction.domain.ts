import { TransactionStatus } from '@prisma/client';

export default class TransactionDomain {
  static isExpired(createdAt: Date): boolean {
    return new Date(Date.now() - 15 * 60 * 1000) > createdAt;
  }

  static countTransactionsByStatus(
    transactions: { status: TransactionStatus }[],
    countableStatus: TransactionStatus[],
  ): number {
    return transactions.reduce((prev, current) => {
      if (countableStatus.find((s) => s === current.status)) return prev + 1;
      return prev;
    }, 0);
  }
}
