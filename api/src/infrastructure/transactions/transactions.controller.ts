import { Controller, Get, Param } from '@nestjs/common';
import { RabbitMQService } from '../shared/rabbitmq/rabbitmq.service';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly rmqService: RabbitMQService, //
  ) {}

  @Get('/:id')
  async findByTransactionId(@Param('id') id: string) {
    return this.rmqService.send('transactions', 'find-transaction-by-id', {
      id,
    });
  }
}
