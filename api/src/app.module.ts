import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SettingsModule } from './infrastructure/settings/settings.module';
import { UsersModule } from './infrastructure/users/users.module';

@Module({
  imports: [SettingsModule, UsersModule],
  controllers: [AppController],
})
export class AppModule {}
