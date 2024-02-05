import { Module } from '@nestjs/common';
import { SettingsModule } from './infrastructure/shared/settings/settings.module';
import { UsersModule } from './infrastructure/users/users.module';

@Module({
  imports: [SettingsModule, UsersModule],
})
export class AppModule {}
