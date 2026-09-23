import { Module } from '@nestjs/common';
import { CategoriesAdminService } from './admin/admin.service.js';
import { CategoriesAdminController } from './admin/admin.controller.js';
import { CategoriesWebController } from './web/web.controller.js';
import { CategoriesWebService } from './web/web.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  providers: [CategoriesAdminService, CategoriesWebService],
  controllers: [CategoriesAdminController, CategoriesWebController],
})
export class CategoriesModule {}
