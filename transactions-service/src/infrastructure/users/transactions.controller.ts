import { Controller, UseFilters } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { FindTransactionByIdUseCase } from 'src/domain/usecases/transactions/find-transaction-by-id.usecase';
import {
  CustomExceptionFilter,
  ZodValidationExceptionFilter,
} from '../shared/filters/custom-exceptions.filter';

@Controller()
export class TransactionsController {
  constructor(
    private readonly findUserByIdUseCase: FindTransactionByIdUseCase,
  ) {}

  @UseFilters(new CustomExceptionFilter(), new ZodValidationExceptionFilter())
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
}
