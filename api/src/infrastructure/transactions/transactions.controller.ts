import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RabbitMQService } from '../shared/rabbitmq/rabbitmq.service';
import { CreateTransactionDTO } from './dtos/create-transaction.dto';

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

  @Post('/')
  async createTransaction(@Body() data: CreateTransactionDTO) {
    return this.rmqService.send('transactions', 'create-transaction', data);
  }
}
