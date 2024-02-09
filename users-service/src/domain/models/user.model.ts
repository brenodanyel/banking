import { UserAddress } from './user-address.model';
import { UserBankingDetails } from './user-banking-details.model';

export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  address?: UserAddress | null;
  bankingDetails?: UserBankingDetails | null;
}
