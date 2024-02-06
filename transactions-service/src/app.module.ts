import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/shared/prisma/prisma.module';
import { RabbitMQModule } from './infrastructure/shared/rabbitmq/rabbitmq.module';
import { SettingsModule } from './infrastructure/shared/settings/settings.module';
import { TransactionsModule } from './infrastructure/transactions/transactions.module';

@Module({
  imports: [SettingsModule, PrismaModule, RabbitMQModule, TransactionsModule],
})
export class AppModule {}
