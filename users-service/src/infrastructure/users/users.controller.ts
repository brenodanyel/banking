import { Controller, UseFilters } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { User } from '@prisma/client';
import { FindUserByIdUseCase } from 'src/domain/usecases/users/find-user-by-id.usecase';
import { UpdateUserByIdUseCase } from 'src/domain/usecases/users/update-user.by-id.usecase';
import {
  CustomExceptionFilter,
  ZodValidationExceptionFilter,
} from '../shared/filters/custom-exceptions.filter';

@Controller()
export class UsersController {
  constructor(
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly updateUserByIdUseCase: UpdateUserByIdUseCase,
  ) {}

  @UseFilters(new CustomExceptionFilter(), new ZodValidationExceptionFilter())
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

  @UseFilters(new CustomExceptionFilter(), new ZodValidationExceptionFilter())
  @MessagePattern('update-user-by-id')
  async updateUserById(
    @Payload() data: { id: string; payload: Partial<User> },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);

    const result = await this.updateUserByIdUseCase.execute(
      data.id,
      data.payload,
    );

    return result;
  }
}
