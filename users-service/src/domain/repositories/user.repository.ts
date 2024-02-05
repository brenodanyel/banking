import { User } from '../models/user.model';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  updateById(id: string, payload: DeepPartial<User>): Promise<User>;
}
