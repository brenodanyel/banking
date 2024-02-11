import { Module } from '@nestjs/common';
import { FindUserByEmailUseCase } from 'src/domain/usecases/users/find-user-by-email.usecase';
import { FindUserByIdUseCase } from '../../domain/usecases/users/find-user-by-id.usecase';
import { UpdateUserByIdUseCase } from '../../domain/usecases/users/update-user.by-id.usecase';
import { UsersController } from './users.controller';
import { UsersPrismaRepository } from './users.prisma.repository';

@Module({
  controllers: [UsersController],
  providers: [
    UsersPrismaRepository,
    {
      provide: FindUserByIdUseCase,
      inject: [UsersPrismaRepository],
      useFactory(usersRepository: UsersPrismaRepository) {
        return new FindUserByIdUseCase(usersRepository);
      },
    },
    {
      provide: UpdateUserByIdUseCase,
      inject: [UsersPrismaRepository],
      useFactory(usersRepository: UsersPrismaRepository) {
        return new UpdateUserByIdUseCase(usersRepository);
      },
    },
    {
      provide: FindUserByEmailUseCase,
      inject: [UsersPrismaRepository],
      useFactory(usersRepository: UsersPrismaRepository) {
        return new FindUserByEmailUseCase(usersRepository);
      },
    },
  ],
})
export class UsersModule {}
