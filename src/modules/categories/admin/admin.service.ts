import { Injectable } from '@nestjs/common';
import {
  CategoryAdminDetailDTO,
  CategoryAdminListItemDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from './admin.dto.js';
import { prisma } from '../../../db/prisma.js';
import { BadRequestError, NotFoundError } from '../../../errors.js';

@Injectable()
export class CategoriesAdminService {
  async getAllCategories(): Promise<CategoryAdminListItemDTO[]> {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        poster: {
          select: {
            base64: true,
          },
        },
      },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      base64: c.poster?.base64 ?? null,
    }));
  }

  async getCategoryDetail(id: string): Promise<CategoryAdminDetailDTO> {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        poster: {
          select: {
            base64: true,
          },
        },
      },
    });

    if (!category) throw new NotFoundError('دسته بندی با این شناسه یافت نشد.');

    return {
      id: category.id,
      name: category.name,
      base64: category.poster?.base64 ?? null,
    };
  }

  async createCategory(data: CreateCategoryDTO) {
    const categoryFound = await prisma.category.findUnique({
      where: {
        name: data.name,
      },
    });

    if (categoryFound) throw new BadRequestError('نام دسته بندی تکراری است.');

    await prisma.category.create({
      data: {
        name: data.name,
        poster: data.base64
          ? {
              create: {
                base64: data.base64,
              },
            }
          : undefined,
      },
    });
  }

  async updateCategory(data: UpdateCategoryDTO) {
    const categoryFound = await prisma.category.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!categoryFound) throw new NotFoundError('دسته بندی یافت نشد.');

    await prisma.$transaction(async (tx) => {
      await tx.category.update({
        where: {
          id: data.id,
        },
        data: {
          name: data.name,
        },
      });

      if (data.base64 === null) {
        await tx.file.delete({
          where: {
            categoryId: data.id,
          },
        });
      } else if (data.base64) {
        await tx.file.update({
          where: {
            categoryId: data.id,
          },
          data: {
            base64: data.base64,
          },
        });
      }
    });
  }
}
