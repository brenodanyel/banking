import { User } from 'src/domain/models/user.model';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { NotFoundException } from 'src/domain/shared/exceptions';

export class FindUserByIdUseCase {
  constructor(
    private readonly userRepository: IUserRepository, //
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id '${id}' was not found`);
    }

    return user;
  }
}
