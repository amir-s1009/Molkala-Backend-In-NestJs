import { StockReservationStatus } from '@prisma/client';

export default class ReservationDomain {
  static calcTotalActiveReservations(
    activeReservations: { qty: number }[],
  ): number {
    return activeReservations.reduce((prev, current) => prev + current.qty, 0);
  }

  static getReservableCapacity(
    productStock: number,
    activeReservations: number,
  ): number {
    return productStock - activeReservations;
  }

  static isReservable(
    reservationRequest: number,
    reservableCapacity: number,
  ): boolean {
    return reservableCapacity > reservationRequest;
  }

  static findExpiredReservation(
    reservations: { status: StockReservationStatus }[],
  ) {
    return reservations.find((r) => r.status === 'EXPIRED');
  }

  static reIssueExpireAt(offsetMinutes?: number): Date {
    return new Date(Date.now() + (offsetMinutes ?? 15) * 60 * 1000);
  }

  static findExpiredDateReservation(reservations: { expiredAt: Date }[]) {
    const now = new Date();
    return reservations.find((r) => now > r.expiredAt);
  }
}
