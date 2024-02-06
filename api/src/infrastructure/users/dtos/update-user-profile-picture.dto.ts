import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserProfilePictureDTO {
  @ApiProperty({ format: 'binary' })
  file: Express.Multer.File;
}
