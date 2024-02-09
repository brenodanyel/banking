import { Test, TestingModule } from '@nestjs/testing';
import { FindUserByIdUseCase } from '../../domain/usecases/users/find-user-by-id.usecase';
import { UpdateUserByIdUseCase } from '../../domain/usecases/users/update-user.by-id.usecase';
import { VALID_USER } from '../../tests/mocks/users.mock';
import { UsersController } from './users.controller';

function mockContext() {
  return {
    getChannelRef: jest.fn().mockReturnValue({ ack: jest.fn() }),
    getMessage: jest.fn(),
  };
}

describe('UsersController', () => {
  let controller: UsersController;

  let findUserByIdUseCase: FindUserByIdUseCase;
  let updateUserByIdUseCase: UpdateUserByIdUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [FindUserByIdUseCase, UpdateUserByIdUseCase],
    }).compile();

    controller = module.get(UsersController);
    findUserByIdUseCase = module.get(FindUserByIdUseCase);
    updateUserByIdUseCase = module.get(UpdateUserByIdUseCase);
  });

  describe('findUserById', () => {
    it('should return the user with the given id', async () => {
      const ctx = mockContext();

      jest.spyOn(findUserByIdUseCase, 'execute').mockResolvedValue(VALID_USER);

      const result = await controller.findUserById(
        { id: VALID_USER.id },
        ctx as any,
      );

      expect(result).toEqual(VALID_USER);
      expect(ctx.getChannelRef().ack).toHaveBeenCalledWith(ctx.getMessage());
    });

    it('should update user correctly', async () => {
      const ctx = mockContext();

      jest.spyOn(updateUserByIdUseCase, 'execute').mockResolvedValue({
        ...VALID_USER,
        name: 'New Name',
      });

      const result = await controller.updateUserById(
        { id: VALID_USER.id, payload: { name: 'New Name' } },
        ctx as any,
      );

      expect(result).toHaveProperty('name', 'New Name');
      expect(ctx.getChannelRef().ack).toHaveBeenCalledWith(ctx.getMessage());
    });
  });
});
