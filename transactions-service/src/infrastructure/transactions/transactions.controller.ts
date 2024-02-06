import { Controller, UseFilters } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateTransactionUsecase } from 'src/domain/usecases/transactions/create-transaction.usecase';
import { FindTransactionByIdUseCase } from 'src/domain/usecases/transactions/find-transaction-by-id.usecase';
import { CustomExceptionFilter } from '../shared/filters/custom-exceptions.filter';

@Controller()
export class TransactionsController {
  constructor(
    private readonly findUserByIdUseCase: FindTransactionByIdUseCase,
    private readonly createTransactionUseCase: CreateTransactionUsecase,
  ) {}

  @UseFilters(new CustomExceptionFilter())
  @MessagePattern('find-transaction-by-id')
  async findTransactionById(
    @Payload() data: { id: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);

    const result = await this.findUserByIdUseCase.execute(data.id);

    return result;
  }

  @UseFilters(new CustomExceptionFilter())
  @MessagePattern('create-transaction')
  async createTransaction(
    @Payload()
    data: {
      senderUserId: string;
      receiverUserId: string;
      amount: number;
      description: string;
    },
    @Ctx()
    context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);

    const result = await this.createTransactionUseCase.execute({
      senderUserId: data.senderUserId,
      receiverUserId: data.receiverUserId,
      amount: data.amount,
      description: data.description,
    });

    return result;
  }
}
