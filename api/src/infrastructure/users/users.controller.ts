import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { RabbitMQService } from '../shared/rabbitmq/rabbitmq.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly rabbitMQService: RabbitMQService, //
  ) {}

  @Get('/:id')
  async findUserById(@Param('id') id: string) {
    try {
      const result = await lastValueFrom(
        this.rabbitMQService.users.send('find-user-by-id', { id }),
      );

      return result;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
