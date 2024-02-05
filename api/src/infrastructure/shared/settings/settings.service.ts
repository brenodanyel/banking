import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISettings } from 'src/domain/shared/settings.interface';

@Injectable()
export class SettingsService implements ISettings {
  constructor(
    private readonly configService: ConfigService, //
  ) {}

  getRabbitMQUrl(): string {
    return this.configService.get<string>('RABBITMQ_URL');
  }
}
