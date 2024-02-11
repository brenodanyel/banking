import { UserAddress } from './user-address.model';
import { UserBankingDetails } from './user-banking-details.model';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  profilePicture: string | null;
  address?: UserAddress | null;
  bankingDetails?: UserBankingDetails | null;
}

export interface UserWithoutPassword extends Omit<User, 'password'> {}
