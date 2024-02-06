import { Module } from '@nestjs/common';
import { CreateTransactionUsecase } from 'src/domain/usecases/transactions/create-transaction.usecase';
import { FindTransactionByIdUseCase } from 'src/domain/usecases/transactions/find-transaction-by-id.usecase';
import { RabbitMQService } from '../shared/rabbitmq/rabbitmq.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsPrismaRepository } from './transactions.prisma.repository';

@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionsPrismaRepository,
    {
      provide: FindTransactionByIdUseCase,
      inject: [TransactionsPrismaRepository],
      useFactory(transactionsRepository: TransactionsPrismaRepository) {
        return new FindTransactionByIdUseCase(transactionsRepository);
      },
    },
    {
      provide: CreateTransactionUsecase,
      inject: [TransactionsPrismaRepository, RabbitMQService],
      useFactory(
        transactionsRepository: TransactionsPrismaRepository,
        rmqService: RabbitMQService,
      ) {
        return new CreateTransactionUsecase(transactionsRepository, rmqService);
      },
    },
  ],
})
export class TransactionsModule {}
