import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './infrastructure/auth/auth.module';
import { RabbitMQModule } from './infrastructure/shared/rabbitmq/rabbitmq.module';
import { SettingsModule } from './infrastructure/shared/settings/settings.module';
import { TransactionsModule } from './infrastructure/transactions/transactions.module';
import { UsersModule } from './infrastructure/users/users.module';

@Module({
  imports: [
    SettingsModule,
    RabbitMQModule,
    UsersModule,
    TransactionsModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
