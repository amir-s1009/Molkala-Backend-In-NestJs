import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../../common/gaurds/authGaurd.js';
import { RoleGuard, Roles } from '../../../common/gaurds/roleGaurd.js';
import { CategoriesAdminService } from './admin.service.js';
import { CreateCategoryDTO, UpdateCategoryDTO } from './admin.dto.js';
import { CustomApiOutput } from '../../../types.js';

@Controller('categories/admin')
@UseGuards(AuthGuard, RoleGuard)
@Roles('ADMIN')
export class CategoriesAdminController {
  constructor(private readonly adminService: CategoriesAdminService) {}

  @Get('getAllCategories')
  async getAllCategories() {
    return await this.adminService.getAllCategories();
  }

  @Get('getAllCategories/:id')
  async getCategoryDetail(@Param('id') id: string) {
    return await this.adminService.getCategoryDetail(id);
  }

  @Post('createCategory')
  async createCategory(@Body() data: CreateCategoryDTO) {
    await this.adminService.createCategory(data);
    return new CustomApiOutput({
      message: 'دسته بندی با موفقیت ایجاد شد.',
    });
  }

  @Put('updateCategory/:id')
  async updateCategory(@Body() data: UpdateCategoryDTO) {
    await this.adminService.updateCategory(data);
    return new CustomApiOutput({
      message: 'دسته بندی با موفقیت ویرایش شد.',
    });
  }
}
