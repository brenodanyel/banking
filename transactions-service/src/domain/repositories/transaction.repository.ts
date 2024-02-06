import { Transaction } from '../models/transaction.model';

export interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;
}
