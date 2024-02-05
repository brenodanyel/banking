import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { RabbitMQService } from '../shared/rabbitmq/rabbitmq.service';
import { UpdateUserDTO } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly rabbitMQService: RabbitMQService, //
  ) {}

  @Get('/:id')
  findUserById(@Param('id') id: string) {
    return lastValueFrom(
      this.rabbitMQService.users.send('find-user-by-id', { id }),
    );
  }

  @Patch('/:id')
  updateUserById(@Param('id') id: string, @Body() payload: UpdateUserDTO) {
    return lastValueFrom(
      this.rabbitMQService.users.send('update-user-by-id', { id, payload }),
    );
  }
}
