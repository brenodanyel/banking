import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SettingsService } from '../shared/settings/settings.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [SettingsService],
      useFactory: (settingsService: SettingsService) => ({
        secret: settingsService.getJWTSecretKey(),
        signOptions: { expiresIn: '120s' },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
