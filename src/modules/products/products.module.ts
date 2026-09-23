import { Module } from '@nestjs/common';
import { AdminController } from './admin/admin.controller.js';
import { AdminService } from './admin/admin.service.js';
import { WebService } from './web/web.service.js';
import { WebController } from './web/web.controller.js';
import ProductDomain from './product.domain.js';

@Module({
  controllers: [AdminController, WebController],
  providers: [AdminService, WebService, ProductDomain],
  exports: [ProductDomain],
})
export class ProductsModule {}
