import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionUsecase } from 'src/domain/usecases/transactions/create-transaction.usecase';
import { FindTransactionByIdUseCase } from 'src/domain/usecases/transactions/find-transaction-by-id.usecase';
import { FindTransactionsByUserIdUseCase } from 'src/domain/usecases/transactions/find-transactions-by-user-id.usecase';
import {
  VALID_TRANSACTION,
  VALID_TRANSACTIONS,
  VALID_TRANSACTION_INPUT,
} from '../../../tests/mocks/transactions.mock';
import { TransactionsController } from './transactions.controller';

function mockContext() {
  return {
    getChannelRef: jest.fn().mockReturnValue({ ack: jest.fn() }),
    getMessage: jest.fn(),
  };
}

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let findTransactionByIdUseCase: FindTransactionByIdUseCase;
  let findTransactionsByUserIdUseCase: FindTransactionsByUserIdUseCase;
  let createTransactionUseCase: CreateTransactionUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: FindTransactionByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindTransactionsByUserIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CreateTransactionUsecase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(TransactionsController);

    findTransactionByIdUseCase = module.get(FindTransactionByIdUseCase);
    createTransactionUseCase = module.get(CreateTransactionUsecase);
    findTransactionsByUserIdUseCase = module.get(
      FindTransactionsByUserIdUseCase,
    );
  });

  describe('findTransactionById', () => {
    it('should call findTransactionByIdUseCase and return the result', async () => {
      const ctx = mockContext();

      jest
        .spyOn(findTransactionByIdUseCase, 'execute')
        .mockResolvedValue(VALID_TRANSACTION);

      const response = await controller.findTransactionById(
        { id: VALID_TRANSACTION.id },
        ctx as any,
      );

      expect(findTransactionByIdUseCase.execute).toHaveBeenCalledWith(
        VALID_TRANSACTION.id,
      );

      expect(response).toBe(VALID_TRANSACTION);

      expect(ctx.getChannelRef().ack).toHaveBeenCalledWith(ctx.getMessage());
    });
  });

  describe('findTransactionByUserId', () => {
    it('should call findTransactionsByUserIdUseCase and return the result', async () => {
      const ctx = mockContext();

      const pagination = { limit: 10, page: 1 };

      jest
        .spyOn(findTransactionsByUserIdUseCase, 'execute')
        .mockResolvedValue(VALID_TRANSACTIONS);

      const response = await controller.findTransactionByUserId(
        { userId: VALID_TRANSACTION.senderUserId, pagination },
        ctx as any,
      );

      expect(findTransactionsByUserIdUseCase.execute).toHaveBeenCalledWith(
        VALID_TRANSACTION.senderUserId,
        pagination,
      );

      expect(response).toBe(VALID_TRANSACTIONS);

      expect(ctx.getChannelRef().ack).toHaveBeenCalledWith(ctx.getMessage());
    });
  });

  describe('createTransaction', () => {
    it('should call createTransactionUseCase and return the result', async () => {
      const ctx = mockContext();

      jest
        .spyOn(createTransactionUseCase, 'execute')
        .mockResolvedValue(VALID_TRANSACTION);

      const response = await controller.createTransaction(
        VALID_TRANSACTION_INPUT,
        ctx as any,
      );

      expect(createTransactionUseCase.execute).toHaveBeenCalledWith(
        VALID_TRANSACTION_INPUT,
      );

      expect(response).toBe(VALID_TRANSACTION);

      expect(ctx.getChannelRef().ack).toHaveBeenCalledWith(ctx.getMessage());
    });
  });
});
