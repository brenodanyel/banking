import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { RabbitMQService } from '../shared/rabbitmq/rabbitmq.service';
import { UpdateUserDTO } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly rmqService: RabbitMQService, //
  ) {}

  @Get('/:id')
  findUserById(@Param('id') id: string) {
    return this.rmqService.send('users', 'find-user-by-id', { id });
  }

  @Patch('/:id')
  updateUserById(@Param('id') id: string, @Body() payload: UpdateUserDTO) {
    return this.rmqService.send('users', 'update-user-by-id', { id, payload });
  }
}
