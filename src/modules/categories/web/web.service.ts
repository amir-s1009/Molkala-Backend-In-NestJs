import { Injectable } from '@nestjs/common';
import { CategoryWebListItemDTO } from './web.dto.js';
import { prisma } from '../../../db/prisma.js';

@Injectable()
export class CategoriesWebService {
  async getAllCategories(): Promise<CategoryWebListItemDTO[]> {
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
}
