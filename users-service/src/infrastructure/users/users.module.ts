import { Module } from '@nestjs/common';
import { FindUserByIdUseCase } from 'src/domain/usecases/users/find-user-by-id.usecase';
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
  ],
})
export class UsersModule {}
