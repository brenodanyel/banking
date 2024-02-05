import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RabbitMQModule } from './infrastructure/shared/rabbitmq/rabbitmq.module';
import { SettingsModule } from './infrastructure/shared/settings/settings.module';
import { UsersModule } from './infrastructure/users/users.module';

@Module({
  imports: [SettingsModule, RabbitMQModule, UsersModule],
  controllers: [AppController],
})
export class AppModule {}
