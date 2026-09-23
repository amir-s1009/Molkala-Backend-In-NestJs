import { Test, TestingModule } from '@nestjs/testing';
import { OrdersAdminService } from './admin.service.js';

describe('AdminService', () => {
  let service: OrdersAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersAdminService],
    }).compile();

    service = module.get<OrdersAdminService>(OrdersAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
