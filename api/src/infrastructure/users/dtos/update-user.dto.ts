import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDTO {
  @ApiProperty({ example: 'John Doe', required: false })
  name?: string;

  @ApiProperty({ example: 'john@doe.com', required: false })
  email?: string;

  @ApiProperty({
    example: 'https://www.example.com/profile.jpg',
    required: false,
  })
  profilePicture?: string;

  @ApiProperty({
    example: {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
      country: 'USA',
    },
    required: false,
  })
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  @ApiProperty({
    example: {
      accountNumber: '123456789',
      agency: '1234',
    },
    required: false,
  })
  bankingDetails?: {
    accountNumber: string;
    agency: string;
  };
}
