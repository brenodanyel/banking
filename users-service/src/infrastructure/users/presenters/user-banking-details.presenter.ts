type UserBankingDetailsPresenterPayload = {
  accountNumber: string;
  agency: string;
};

export class UserBankingDetailsPresenter {
  accountNumber: string;
  agency: string;

  constructor(payload: UserBankingDetailsPresenterPayload) {
    this.accountNumber = payload.accountNumber;
    this.agency = payload.agency;
  }
}
