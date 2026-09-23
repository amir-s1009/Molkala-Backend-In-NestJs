import { Injectable } from '@nestjs/common';

@Injectable()
export default class ProductDomain {
  sortIds(ids: string[]): string[] {
    return ids.sort((a, b) => a.localeCompare(b));
  }
}
