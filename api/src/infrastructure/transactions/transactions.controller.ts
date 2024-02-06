import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RabbitMQService } from '../shared/rabbitmq/rabbitmq.service';
import { CreateTransactionDTO } from './dtos/create-transaction.dto';

@Controller('transactions')
@ApiTags('Transactions')
export class TransactionsController {
  constructor(
    private readonly rmqService: RabbitMQService, //
  ) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Find transaction by id' })
  @ApiResponse({
    status: 200,
    description: 'The transaction has been successfully found',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findByTransactionId(@Param('id') id: string) {
    return this.rmqService.send('transactions', 'find-transaction-by-id', {
      id,
    });
  }

  @Get('/user/:userId')
  @ApiOperation({ summary: 'Find transactions by user id' })
  @ApiResponse({
    status: 200,
    description: 'The transactions have been successfully found',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findByTransactionUserId(@Param('userId') userId: string) {
    return this.rmqService.send('transactions', 'find-transaction-by-user-id', {
      userId,
    });
  }

  @Post('/')
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createTransaction(@Body() data: CreateTransactionDTO) {
    return this.rmqService.send('transactions', 'create-transaction', data);
  }
}
