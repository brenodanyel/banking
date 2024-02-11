import { UserAddress } from 'src/domain/models/user-address.model';
import { UserBankingDetails } from 'src/domain/models/user-banking-details.model';
import { UserAddressPresenter } from './user-address.presenter';
import { UserBankingDetailsPresenter } from './user-banking-details.presenter';

type UserPresenterPayload = {
  id: string;
  name: string;
  email: string;
  password: string;
  profilePicture: string | null;
  address?: UserAddress | null;
  bankingDetails?: UserBankingDetails | null;
};

export class UserPresenter {
  id: string;
  name: string;
  email: string;
  password: string;
  profilePicture: string | null;
  address?: UserAddress | null;
  bankingDetails?: UserBankingDetails | null;

  constructor(payload: UserPresenterPayload) {
    this.id = payload.id;
    this.name = payload.name;
    this.email = payload.email;
    this.password = payload.password;
    this.profilePicture = payload.profilePicture;

    this.address = payload.address
      ? new UserAddressPresenter(payload.address)
      : null;

    this.bankingDetails = payload.bankingDetails
      ? new UserBankingDetailsPresenter(payload.bankingDetails)
      : null;
  }
}
