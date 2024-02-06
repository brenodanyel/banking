import { Transaction } from 'src/domain/models/transaction.model';
import { ITransactionRepository } from 'src/domain/repositories/transaction.repository';
import { NotFoundException } from 'src/domain/shared/exceptions';
import { IRabbitMQ } from 'src/domain/shared/rabbitmq.interface';

export class FindTransactionsByUserIdUseCase {
  constructor(
    private readonly transactionsRepository: ITransactionRepository,
    private readonly rmqService: IRabbitMQ,
  ) {}

  async execute(userId: string): Promise<Transaction[]> {
    await this.rmqService
      .send('users', 'find-user-by-id', { id: userId })
      .catch(() => {
        throw new NotFoundException('User not found');
      });

    const transactions = await this.transactionsRepository.findByUserId(userId);

    return transactions;
  }
}
