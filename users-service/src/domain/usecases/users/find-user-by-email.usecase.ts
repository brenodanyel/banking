import { User } from 'src/domain/models/user.model';
import { IUserRepository } from 'src/domain/repositories/user.repository';

export class FindUserByEmailUseCase {
  constructor(
    private readonly userRepository: IUserRepository, //
  ) {}

  async execute(email: string): Promise<User | null> {
    const user = await this.userRepository.findUserByEmail(email);
    return user;
  }
}
