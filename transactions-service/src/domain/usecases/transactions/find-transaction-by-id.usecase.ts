import { Transaction } from 'src/domain/models/transaction.model';
import { ITransactionRepository } from 'src/domain/repositories/transaction.repository';
import { NotFoundException } from 'src/domain/shared/exceptions';

export class FindTransactionByIdUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository, //
  ) {}

  async execute(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new NotFoundException(`Transaction with id '${id}' was not found`);
    }

    return transaction;
  }
}
