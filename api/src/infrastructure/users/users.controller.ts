import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RabbitMQService } from '../shared/rabbitmq/rabbitmq.service';
import { StorageService } from '../shared/storage/storage.service';
import { UpdateUserDTO } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly rmqService: RabbitMQService, //
    private readonly storageService: StorageService,
  ) {}

  @Get('/:id')
  async findUserById(@Param('id') id: string) {
    return this.rmqService.send('users', 'find-user-by-id', { id });
  }

  @Patch('/:id')
  async updateUserById(
    @Param('id') id: string,
    @Body() payload: UpdateUserDTO,
  ) {
    return this.rmqService.send('users', 'update-user-by-id', { id, payload });
  }

  @Patch('/:id/profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async updateUserProfilePictureById(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // 2MB
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const url = await this.storageService.uploadFile(
      file.buffer,
      'pfp',
      file.mimetype,
    );

    return this.rmqService.send('users', 'update-user-by-id', {
      id,
      payload: { profilePicture: url },
    });
  }
}
