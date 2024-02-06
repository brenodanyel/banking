import { User } from 'src/domain/models/user.model';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { NotFoundException } from 'src/domain/shared/exceptions';
import * as z from 'zod';

const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  profilePicture: z.string().url().optional(),

  address: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string().length(2),
      zip: z.string().regex(/^\d{5}-\d{3}$/),
      country: z.string(),
    })
    .optional(),

  bankingDetails: z
    .object({
      accountNumber: z.string(),
      agency: z.string(),
    })
    .nullable()
    .optional(),
});

export class UpdateUserByIdUseCase {
  constructor(
    private readonly userRepository: IUserRepository, //
  ) {}

  async execute(
    id: string,
    input: z.infer<typeof updateUserSchema>,
  ): Promise<User> {
    const data = await updateUserSchema.parseAsync(input, {
      async: true,
    });

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id '${id}' was not found`);
    }

    const result = await this.userRepository.updateById(id, data);

    return result;
  }
}
