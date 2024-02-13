import { Controller, UseFilters } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { User } from '@prisma/client';
import { UserWithoutPassword } from 'src/domain/models/user.model';
import { CreateUserUseCase } from 'src/domain/usecases/users/create-user.usecase';
import { FindUserByEmailUseCase } from 'src/domain/usecases/users/find-user-by-email.usecase';
import { FindUserByIdUseCase } from '../../domain/usecases/users/find-user-by-id.usecase';
import { UpdateUserByIdUseCase } from '../../domain/usecases/users/update-user.by-id.usecase';
import { CustomExceptionFilter } from '../shared/filters/custom-exceptions.filter';
import { UserPresenter } from './presenters/user.presenter';

@Controller()
export class UsersController {
  constructor(
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly updateUserByIdUseCase: UpdateUserByIdUseCase,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @UseFilters(new CustomExceptionFilter())
  @MessagePattern('find-user-by-id')
  async findUserById(
    @Payload() data: { id: string },
    @Ctx() context: RmqContext,
  ): Promise<UserWithoutPassword> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);

    const user = await this.findUserByIdUseCase.execute(data.id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = new UserPresenter(user);

    return userWithoutPassword;
  }

  @UseFilters(new CustomExceptionFilter())
  @MessagePattern('update-user-by-id')
  async updateUserById(
    @Payload() data: { id: string; payload: Partial<User> },
    @Ctx() context: RmqContext,
  ): Promise<UserWithoutPassword> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);

    const user = await this.updateUserByIdUseCase.execute(
      data.id,
      data.payload,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = new UserPresenter(user);

    return userWithoutPassword;
  }

  @UseFilters(new CustomExceptionFilter())
  @MessagePattern('find-user-by-email')
  async findUserByEmail(
    @Payload() data: { email: string },
    @Ctx() context: RmqContext,
  ): Promise<UserPresenter | null> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);

    const user = await this.findUserByEmailUseCase.execute(data.email);

    if (!user) {
      return null;
    }

    return new UserPresenter(user);
  }

  @UseFilters(new CustomExceptionFilter())
  @MessagePattern('create-user')
  async createUser(
    @Payload() data: Record<string, unknown>,
    @Ctx() context: RmqContext,
  ): Promise<UserWithoutPassword> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);

    const user = await this.createUserUseCase.execute(data);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = new UserPresenter(user);

    return userWithoutPassword;
  }
}
