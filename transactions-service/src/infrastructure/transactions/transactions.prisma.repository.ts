import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/domain/models/transaction.model';
import { ITransactionRepository } from 'src/domain/repositories/transaction.repository';
import {
  PaginatedResult,
  PaginationInput,
} from 'src/domain/shared/pagination.interface';
import { PrismaService } from '../shared/prisma/prisma.service';

@Injectable()
export class TransactionsPrismaRepository implements ITransactionRepository {
  constructor(
    private readonly prismaService: PrismaService, //
  ) {}

  async findById(id: string): Promise<Transaction | null> {
    const result = await this.prismaService.transaction.findUnique({
      where: { id },
    });

    return result;
  }

  async create(transaction: Transaction): Promise<Transaction> {
    const result = await this.prismaService.transaction.create({
      data: transaction,
    });

    return result;
  }

  async findByUserId(
    userId: string,
    pagination: PaginationInput,
  ): Promise<PaginatedResult<Transaction>> {
    const [data, metadata] = await this.prismaService.extendend.transaction
      .paginate({
        where: { senderUserId: userId },
      })
      .withPages({
        page: pagination.page || 1,
        limit: Math.min(pagination.limit || 10, 100),
      });

    return { data, metadata };
  }
}
