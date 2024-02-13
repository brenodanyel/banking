import { User } from '../models/user.model';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
};

export interface IUserRepository {
  create(payload: CreateUserPayload): Promise<User>;

  findById(id: string): Promise<User | null>;

  findUserByEmail(email: string): Promise<User | null>;

  updateById(id: string, payload: DeepPartial<User>): Promise<User>;
}
