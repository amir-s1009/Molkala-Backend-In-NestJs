import { Module } from '@nestjs/common';
import { AdminService } from './admin/admin.service.js';
import { AdminController } from './admin/admin.controller.js';
import { WebController } from './web/web.controller.js';
import { WebService } from './web/web.service.js';

@Module({
  providers: [AdminService, WebService],
  controllers: [AdminController, WebController]
})
export class CategoriesModule {}
