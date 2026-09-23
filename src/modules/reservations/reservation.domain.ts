import { Injectable } from '@nestjs/common';
import { StockReservationStatus } from '@prisma/client';

@Injectable()
export default class ReservationDomain {
  calcTotalActiveReservations(activeReservations: { qty: number }[]): number {
    return activeReservations.reduce((prev, current) => prev + current.qty, 0);
  }

  getReservableCapacity(
    productStock: number,
    activeReservations: number,
  ): number {
    return productStock - activeReservations;
  }

  isReservable(
    reservationRequest: number,
    reservableCapacity: number,
  ): boolean {
    return reservableCapacity > reservationRequest;
  }

  findExpiredReservation(reservations: { status: StockReservationStatus }[]) {
    return reservations.find((r) => r.status === 'EXPIRED');
  }

  reIssueExpireAt(offsetMinutes?: number): Date {
    return new Date(Date.now() + (offsetMinutes ?? 15) * 60 * 1000);
  }

  findExpiredDateReservation(reservations: { expiredAt: Date }[]) {
    const now = new Date();
    return reservations.find((r) => now > r.expiredAt);
  }
}
