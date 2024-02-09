import { ITransactionRepository } from 'src/domain/repositories/transaction.repository';
import { NotFoundException } from 'src/domain/shared/exceptions';
import { IRabbitMQ } from 'src/domain/shared/rabbitmq.interface';
import { VALID_TRANSACTIONS } from '../../../../tests/mocks/transactions.mock';
import { FindTransactionsByUserIdUseCase } from './find-transactions-by-user-id.usecase';

describe('FindTransactionsByUserIdUseCase', () => {
  let usecase: FindTransactionsByUserIdUseCase;
  let transactionsRepository: ITransactionRepository;
  let rmqService: IRabbitMQ<unknown>;

  beforeEach(() => {
    transactionsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
    };

    rmqService = {
      send: jest.fn(),
      emit: jest.fn(),
    } as any;

    usecase = new FindTransactionsByUserIdUseCase(
      transactionsRepository,
      rmqService,
    );
  });

  it('should return a transaction successfully', async () => {
    const USER_ID = '123';
    jest.spyOn(rmqService, 'send').mockResolvedValue({ id: USER_ID });

    jest
      .spyOn(transactionsRepository, 'findByUserId')
      .mockResolvedValue(VALID_TRANSACTIONS);

    const result = await usecase.execute(USER_ID, {});
    expect(result).toEqual(VALID_TRANSACTIONS);

    expect(transactionsRepository.findByUserId).toHaveBeenCalledWith(
      USER_ID,
      {},
    );

    expect(rmqService.send).toHaveBeenCalledWith('users', 'find-user-by-id', {
      id: USER_ID,
    });
  });

  it('should throw if user not found', async () => {
    const USER_ID = '123';
    jest.spyOn(rmqService, 'send').mockRejectedValue(new NotFoundException());

    const promise = usecase.execute(USER_ID, {});
    await expect(promise).rejects.toThrow(NotFoundException);

    expect(rmqService.send).toHaveBeenCalledWith('users', 'find-user-by-id', {
      id: USER_ID,
    });

    expect(transactionsRepository.findByUserId).not.toHaveBeenCalled();
  });
});
