import { Module } from '@nestjs/common';
import { AdminController } from './admin/admin.controller.js';
import { UserController } from './user/user.controller.js';
import { UserService } from './user/user.service.js';
import { AdminService } from './admin/admin.service.js';

@Module({
  controllers: [AdminController, UserController],
  providers: [UserService, AdminService]
})
export class TransactionsModule {}
