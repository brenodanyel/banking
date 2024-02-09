import { ITransactionRepository } from 'src/domain/repositories/transaction.repository';
import { NotFoundException } from 'src/domain/shared/exceptions';
import { VALID_TRANSACTION } from '../../../../tests/mocks/transactions.mock';
import { FindTransactionByIdUseCase } from './find-transaction-by-id.usecase';

describe('FindTransactionByIdUseCase', () => {
  let useCase: FindTransactionByIdUseCase;
  let transactionRepository: ITransactionRepository;

  beforeEach(() => {
    transactionRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      findByUserId: jest.fn(),
    };
    useCase = new FindTransactionByIdUseCase(transactionRepository);
  });

  it('should return the transaction when found', async () => {
    jest
      .spyOn(transactionRepository, 'findById')
      .mockResolvedValue(VALID_TRANSACTION);

    const result = await useCase.execute(VALID_TRANSACTION.id);

    expect(result).toEqual(VALID_TRANSACTION);
    expect(transactionRepository.findById).toHaveBeenCalledWith(
      VALID_TRANSACTION.id,
    );
  });

  it('should throw NotFoundException when transaction is not found', async () => {
    jest.spyOn(transactionRepository, 'findById').mockResolvedValue(null);

    await expect(useCase.execute('invalid-id')).rejects.toThrow(
      NotFoundException,
    );

    expect(transactionRepository.findById).toHaveBeenCalledWith('invalid-id');
  });
});
