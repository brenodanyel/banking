import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { SettingsService } from './infrastructure/shared/settings/settings.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const settingsService = app.get(SettingsService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [settingsService.getRabbitMQUrl()],
      queue: 'users_queue',
      noAck: false,
    },
  });

  await app.startAllMicroservices();
  await app.init();
}
bootstrap();
