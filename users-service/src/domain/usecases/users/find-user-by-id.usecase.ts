import { User } from 'src/domain/models/user.model';
import { IUserRepository } from 'src/domain/repositories/user.repository';

export class FindUserByIdUseCase {
  constructor(
    private readonly userRepository: IUserRepository, //
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    return user;
  }
}
