import { Injectable } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class RabbitMQService {
  constructor(
    private readonly settingsService: SettingsService, //
  ) {}

  private services = {
    users: ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.settingsService.getRabbitMQUrl()],
        queue: 'users_queue',
      },
    }),
  };

  async send<T>(service: keyof typeof this.services, pattern: string, data: T) {
    return lastValueFrom(this.services[service].send(pattern, data));
  }

  async emit<T>(service: keyof typeof this.services, pattern: string, data: T) {
    this.services[service].emit(pattern, data);
  }
}
