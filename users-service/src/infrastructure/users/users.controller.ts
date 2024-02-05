import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';

@Controller()
export class UsersController {
  @MessagePattern('find-user-by-id')
  async findUserById(
    @Payload() data: Record<string, unknown>,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const result = { id: data.id, name: 'John doe', t: Date.now() };
      channel.ack(originalMsg);
      return result;
    } catch (error) {
      channel.nack(originalMsg);
      throw new RpcException(error);
    }
  }
}
