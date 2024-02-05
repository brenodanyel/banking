import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SettingsService } from './settings.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
