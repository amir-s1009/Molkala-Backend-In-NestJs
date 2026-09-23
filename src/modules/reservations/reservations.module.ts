import { Module } from '@nestjs/common';
import ReservationDomain from './reservation.domain.js';

@Module({
  providers: [ReservationDomain],
  exports: [ReservationDomain],
})
export class ReservationsModule {}
