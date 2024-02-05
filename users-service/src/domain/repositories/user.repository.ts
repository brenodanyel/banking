import { User } from '../models/user.model';

export interface IUserRepository {
  findById(id: string): Promise<User>;
  updateById(id: string, payload: Partial<User>): Promise<User>;
}
