import { Test, TestingModule } from '@nestjs/testing';
import { OrdersUserService } from './user.service.js';

describe('UserService', () => {
  let service: OrdersUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersUserService],
    }).compile();

    service = module.get<OrdersUserService>(OrdersUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
