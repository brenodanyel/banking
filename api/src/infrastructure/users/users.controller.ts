import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/guards/auth.guard';
import { RabbitMQService } from '../shared/rabbitmq/rabbitmq.service';
import { StorageService } from '../shared/storage/storage.service';
import { UpdateUserDTO } from './dtos/update-user.dto';
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly rmqService: RabbitMQService,
    private readonly storageService: StorageService,
  ) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Find user by id' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully found',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UseGuards(AuthGuard('local'), LocalAuthGuard)
  async findUserById(@Param('id') id: string) {
    return this.rmqService.send('users', 'find-user-by-id', { id });
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateUserById(
    @Param('id') id: string,
    @Body() payload: UpdateUserDTO,
  ) {
    return this.rmqService.send('users', 'update-user-by-id', { id, payload });
  }

  @Patch('/:id/profile-picture')
  @ApiOperation({ summary: 'Update user profile picture by id' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The user profile picture (max size: 2MB)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "The user's profile picture has been successfully found",
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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

  @Post('/')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created',
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  createUser(@Body() data: { name: string; email: string; password: string }) {
    return this.rmqService.send('users', 'create-user', {
      name: data.name,
      email: data.email,
      password: data.password,
    });
  }
}
