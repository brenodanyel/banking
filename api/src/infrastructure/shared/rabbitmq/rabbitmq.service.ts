import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { IRabbitMQClientFactory } from 'src/domain/shared/rabbitmq.interface';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class RabbitMQService implements IRabbitMQClientFactory<ClientProxy> {
  constructor(
    private readonly settingsService: SettingsService, //
  ) {}

  users = ClientProxyFactory.create({
    transport: Transport.RMQ,
    options: {
      urls: [this.settingsService.getRabbitMQUrl()],
      queue: 'users_queue',
    },
  });
}
