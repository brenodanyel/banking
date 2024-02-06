import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDTO {
  @ApiProperty({ example: 'random-cuid' })
  senderUserId: string;

  @ApiProperty({ example: 'random-cuid' })
  receiverUserId: string;

  @ApiProperty({ example: 100 })
  amount: number;

  @ApiProperty({ example: 'Transaction description' })
  description: string;
}
