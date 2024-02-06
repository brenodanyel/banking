import { Transaction } from 'src/domain/models/transaction.model';
import { ITransactionRepository } from 'src/domain/repositories/transaction.repository';
import { NotFoundException } from 'src/domain/shared/exceptions';
import { IRabbitMQ } from 'src/domain/shared/rabbitmq.interface';
import * as z from 'zod';

const createTransactionSchema = z.object({
  senderUserId: z.string(),
  receiverUserId: z.string(),
  amount: z.number().positive(),
  description: z.string(),
});

export class CreateTransactionUsecase {
  constructor(
    private readonly transactionsRepository: ITransactionRepository,
    private readonly rmqService: IRabbitMQ<unknown>,
  ) {}

  async execute(
    input: z.infer<typeof createTransactionSchema>,
  ): Promise<Transaction> {
    const data = await createTransactionSchema.parseAsync(input);

    await this.rmqService
      .send('users', 'find-user-by-id', { id: data.senderUserId })
      .catch(() => {
        throw new NotFoundException('Sender not found');
      });

    await this.rmqService
      .send('users', 'find-user-by-id', { id: data.receiverUserId })
      .catch(() => {
        throw new NotFoundException('Receiver not found');
      });

    const transaction = await this.transactionsRepository.create({
      amount: data.amount,
      description: data.description,
      receiverUserId: data.receiverUserId,
      senderUserId: data.senderUserId,
    });

    return transaction;
  }
}
