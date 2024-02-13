import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SettingsService } from 'src/infrastructure/shared/settings/settings.service';

export interface AuthPresenter {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    settingsService: SettingsService, //
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: settingsService.getJWTSecretKey(),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any): Promise<AuthPresenter> {
    return {
      sub: payload.sub,
      email: payload.email,
    };
  }
}
