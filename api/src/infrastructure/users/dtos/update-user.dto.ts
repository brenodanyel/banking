export class UpdateUserDTO {
  name: string;

  email: string;

  profilePicture: string;

  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  bankingDetails: {
    accountNumber: string;
    agency: string;
  };
}
