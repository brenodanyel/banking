import { Transaction } from 'src/domain/models/transaction.model';
import { PaginatedResult } from 'src/domain/shared/pagination.interface';

export const VALID_TRANSACTION: Transaction = {
  id: '123',
  amount: 100,
  description: 'test description',
  receiverUserId: 'receiver123',
  senderUserId: 'sender123',
};

export const VALID_TRANSACTION_INPUT = {
  senderUserId: VALID_TRANSACTION.senderUserId,
  receiverUserId: VALID_TRANSACTION.receiverUserId,
  amount: VALID_TRANSACTION.amount,
  description: VALID_TRANSACTION.description,
};

export const VALID_TRANSACTIONS: PaginatedResult<Transaction> = {
  data: [VALID_TRANSACTION],
  metadata: {
    currentPage: 1,
    isFirstPage: true,
    isLastPage: true,
    nextPage: null,
    pageCount: 1,
    previousPage: null,
    totalCount: 1,
  },
};
