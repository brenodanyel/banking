import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { FindUserByIdUseCase } from 'src/domain/usecases/users/find-user-by-id.usecase';

@Controller()
export class UsersController {
  constructor(
    private readonly findUserByIdUseCase: FindUserByIdUseCase, //
  ) {}

  @MessagePattern('find-user-by-id')
  async findUserById(
    @Payload() data: { id: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const result = await this.findUserByIdUseCase.execute(data.id);
      channel.ack(originalMsg);
      return result;
    } catch (error) {
      channel.nack(originalMsg);
      throw new RpcException(error);
    }
  }
}
