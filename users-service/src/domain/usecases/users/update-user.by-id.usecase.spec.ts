import { IUserRepository } from '../../../domain/repositories/user.repository';
import { VALID_USER } from '../../../tests/mocks/users.mock';
import { NotFoundException } from '../../shared/exceptions';
import { UpdateUserByIdUseCase } from './update-user.by-id.usecase';

describe('FindUserByIdUseCase', () => {
  let useCase: UpdateUserByIdUseCase;
  let userRepository: IUserRepository;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      updateById: jest.fn(),
    };
    useCase = new UpdateUserByIdUseCase(userRepository);
  });

  it('should update user correctly', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValue(VALID_USER);
    jest.spyOn(userRepository, 'updateById').mockResolvedValue({
      ...VALID_USER,
      name: 'Other name',
    });

    const result = await useCase.execute(VALID_USER.id, { name: 'Other name' });

    expect(result).toHaveProperty('id', VALID_USER.id);
    expect(result).toHaveProperty('name', 'Other name');

    expect(userRepository.findById).toHaveBeenCalledWith(VALID_USER.id);
  });

  it('should throw NotFoundException when user is not found', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

    const promise = useCase.execute(VALID_USER.id, { name: 'Other name' });

    await expect(promise).rejects.toThrow(NotFoundException);

    expect(userRepository.findById).toHaveBeenCalledWith(VALID_USER.id);
  });
});
