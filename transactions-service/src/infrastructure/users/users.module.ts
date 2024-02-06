import { Module } from '@nestjs/common';
import { FindTransactionByIdUseCase } from 'src/domain/usecases/transactions/find-transaction-by-id.usecase';
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
  ],
})
export class TransactionsModule {}
