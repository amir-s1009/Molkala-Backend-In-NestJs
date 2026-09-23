import { Controller, Get } from '@nestjs/common';
import { CategoriesWebService } from './web.service.js';

@Controller('categories/web')
export class CategoriesWebController {
  constructor(private readonly webService: CategoriesWebService) {}

  @Get('getAllCategories')
  async getAllCategories() {
    return await this.webService.getAllCategories();
  }
}
