import { Transaction } from '../models/transaction.model';
import {
  PaginatedResult,
  PaginationInput,
} from '../shared/pagination.interface';

export interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;

  findByUserId(
    userId: string,
    pagination: PaginationInput,
  ): Promise<PaginatedResult<Transaction>>;

  create(transaction: Omit<Transaction, 'id'>): Promise<Transaction>;
}
