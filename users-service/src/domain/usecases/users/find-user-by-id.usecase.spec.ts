import { IUserRepository } from '../../../domain/repositories/user.repository';
import { NotFoundException } from '../../shared/exceptions';
import { VALID_USER } from '../../../tests/mocks/users.mock';
import { FindUserByIdUseCase } from './find-user-by-id.usecase';

describe('FindUserByIdUseCase', () => {
  let useCase: FindUserByIdUseCase;
  let userRepository: IUserRepository;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      updateById: jest.fn(),
    };
    useCase = new FindUserByIdUseCase(userRepository);
  });

  it('should return the user when found', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValue(VALID_USER);

    const result = await useCase.execute(VALID_USER.id);

    expect(result).toEqual(VALID_USER);
    expect(userRepository.findById).toHaveBeenCalledWith(VALID_USER.id);
  });

  it('should throw NotFoundException when user is not found', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

    const promise = useCase.execute(VALID_USER.id);

    await expect(promise).rejects.toThrow(NotFoundException);

    expect(userRepository.findById).toHaveBeenCalledWith(VALID_USER.id);
  });
});
