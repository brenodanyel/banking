import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { IRabbitMQ } from 'src/domain/shared/rabbitmq.interface';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class RabbitMQService implements IRabbitMQ<ClientProxy> {
  constructor(
    private readonly settingsService: SettingsService, //
  ) {}

  services = {
    users: ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.settingsService.getRabbitMQUrl()],
        queue: 'users_queue',
      },
    }),

    transactions: ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.settingsService.getRabbitMQUrl()],
        queue: 'transactions_queue',
      },
    }),
  };

  async send(
    service: keyof typeof this.services,
    pattern: string,
    data: unknown,
  ) {
    return lastValueFrom(this.services[service].send(pattern, data));
  }

  async emit(
    service: keyof typeof this.services,
    pattern: string,
    data: unknown,
  ) {
    this.services[service].emit(pattern, data);
  }
}
