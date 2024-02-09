import { ITransactionRepository } from 'src/domain/repositories/transaction.repository';
import { NotFoundException } from 'src/domain/shared/exceptions';
import { IRabbitMQ } from 'src/domain/shared/rabbitmq.interface';
import {
  VALID_TRANSACTION,
  VALID_TRANSACTION_INPUT,
} from '../../../../tests/mocks/transactions.mock';
import { CreateTransactionUsecase } from './create-transaction.usecase';

describe('CreateTransactionUsecase', () => {
  let usecase: CreateTransactionUsecase;
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

    usecase = new CreateTransactionUsecase(transactionsRepository, rmqService);
  });

  it('should create a transaction successfully', async () => {
    jest.spyOn(rmqService, 'send').mockResolvedValue(VALID_TRANSACTION);
    jest
      .spyOn(transactionsRepository, 'create')
      .mockResolvedValue(VALID_TRANSACTION);

    const result = await usecase.execute(VALID_TRANSACTION_INPUT);
    expect(result).toEqual(VALID_TRANSACTION);

    expect(transactionsRepository.create).toHaveBeenCalledWith(
      VALID_TRANSACTION_INPUT,
    );

    expect(rmqService.send).toHaveBeenCalledWith('users', 'find-user-by-id', {
      id: VALID_TRANSACTION.senderUserId,
    });

    expect(rmqService.send).toHaveBeenCalledWith('users', 'find-user-by-id', {
      id: VALID_TRANSACTION.receiverUserId,
    });
  });

  it('should throw NotFoundException if sender is not found', async () => {
    jest
      .spyOn(rmqService, 'send')
      .mockRejectedValue(new NotFoundException('Sender not found'));

    const promise = usecase.execute(VALID_TRANSACTION_INPUT);
    await expect(promise).rejects.toThrow(NotFoundException);

    expect(transactionsRepository.create).not.toHaveBeenCalled();

    expect(rmqService.send).toHaveBeenCalledWith('users', 'find-user-by-id', {
      id: VALID_TRANSACTION.senderUserId,
    });
  });

  it('should throw NotFoundException if receiver is not found', async () => {
    jest
      .spyOn(rmqService, 'send')
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new NotFoundException('Receiver not found'));

    const promise = usecase.execute(VALID_TRANSACTION_INPUT);
    await expect(promise).rejects.toThrow(NotFoundException);

    expect(transactionsRepository.create).not.toHaveBeenCalled();

    expect(rmqService.send).toHaveBeenCalledWith('users', 'find-user-by-id', {
      id: VALID_TRANSACTION.senderUserId,
    });

    expect(rmqService.send).toHaveBeenCalledWith('users', 'find-user-by-id', {
      id: VALID_TRANSACTION.receiverUserId,
    });
  });
});
