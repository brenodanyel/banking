import { Controller, UseFilters } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { FindUserByIdUseCase } from 'src/domain/usecases/users/find-user-by-id.usecase';
import { CustomExceptionFilter } from '../shared/filters/custom-exceptions.filter';

@Controller()
export class UsersController {
  constructor(
    private readonly findUserByIdUseCase: FindUserByIdUseCase, //
  ) {}

  @UseFilters(new CustomExceptionFilter())
  @MessagePattern('find-user-by-id')
  async findUserById(
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
