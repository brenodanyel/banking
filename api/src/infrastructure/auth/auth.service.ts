import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { RabbitMQService } from '../shared/rabbitmq/rabbitmq.service';

// Tempo gasto até então: 2h

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly rmqService: RabbitMQService, //
  ) {}

  async login(email: string, password: string) {
    const user = await this.rmqService.send('users', 'find-user-by-email', {
      email,
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais Inválidas.');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciais Inválidas.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithOutPassword } = user;

    const accessToken = this.jwtService.sign({
      email: user.email,
      role: user.role,
      sub: user.id,
    });

    return {
      user: userWithOutPassword,
      access_token: accessToken,
    };
  }
}
