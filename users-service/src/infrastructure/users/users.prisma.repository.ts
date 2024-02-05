import { Injectable } from '@nestjs/common';
import { User } from 'src/domain/models/user.model';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { PrismaService } from '../shared/prisma/prisma.service';

@Injectable()
export class UsersPrismaRepository implements IUserRepository {
  constructor(
    private readonly prismaService: PrismaService, //
  ) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.prismaService.user.findUnique({
      where: { id },
    });

    return result;
  }

  async updateById(id: string, payload: Partial<User>): Promise<User> {
    console.log({ id, payload });
    throw new Error('Method not implemented.');
  }
}
