import { hash } from 'bcryptjs';
import { User } from 'src/domain/models/user.model';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { ConflictException } from 'src/domain/shared/exceptions';
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository, //
  ) {}

  async execute(input: z.infer<typeof createUserSchema>): Promise<User> {
    const data = createUserSchema.parse(input);

    const userAlreadyExists = await this.userRepository.findUserByEmail(
      data.email,
    );

    if (userAlreadyExists) {
      throw new ConflictException('User already exists');
    }

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: await hash(data.password, 8),
    });

    return user;
  }
}
