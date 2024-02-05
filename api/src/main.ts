import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { SettingsService } from './infrastructure/settings/settings.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const settingsService = app.get(SettingsService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [settingsService.getRabbitMQUrl()],
      queue: 'user_queue',
      queueOptions: {},
    },
  });

  app.setGlobalPrefix('/api');

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
