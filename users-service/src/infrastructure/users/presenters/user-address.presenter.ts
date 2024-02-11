type UserAddressPresenterPayload = {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
};

export class UserAddressPresenter {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;

  constructor(payload: UserAddressPresenterPayload) {
    this.street = payload.street;
    this.city = payload.city;
    this.state = payload.state;
    this.country = payload.country;
    this.zip = payload.zip;
  }
}
