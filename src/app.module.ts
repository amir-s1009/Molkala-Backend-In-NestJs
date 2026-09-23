import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { LoggerMiddleware } from './common/middlewares/logger.middleware.js';
import { CartsModule } from './modules/carts/carts.module.js';
import { CategoriesModule } from './modules/categories/categories.module.js';
import { OrdersModule } from './modules/orders/orders.module.js';
import { PaymentModule } from './modules/payment/payment.module.js';
import { ProductsModule } from './modules/products/products.module.js';
import { TransactionsModule } from './modules/transactions/transactions.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ReservationsModule } from './modules/reservations/reservations.module.js';

@Module({
  imports: [CartsModule, CategoriesModule, OrdersModule, PaymentModule, ProductsModule, TransactionsModule, UsersModule, AuthModule, ReservationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
