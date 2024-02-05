import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/shared/prisma/prisma.module';
import { SettingsModule } from './infrastructure/shared/settings/settings.module';
import { UsersModule } from './infrastructure/users/users.module';

@Module({
  imports: [SettingsModule, PrismaModule, UsersModule],
})
export class AppModule {}
