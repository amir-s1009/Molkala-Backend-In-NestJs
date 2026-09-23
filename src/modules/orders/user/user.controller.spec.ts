import { Test, TestingModule } from '@nestjs/testing';
import { OrdersUserController } from './user.controller.js';

describe('UserController', () => {
  let controller: OrdersUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersUserController],
    }).compile();

    controller = module.get<OrdersUserController>(OrdersUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
