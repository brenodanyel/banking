import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
      include: {
        address: true,
        bankingDetails: true,
      },
    });

    return result;
  }

  async updateById(id: string, payload: Partial<User>): Promise<User> {
    const data: Prisma.UserUpdateInput = {
      name: payload.name,
      email: payload.email,
      profilePicture: payload.profilePicture,
    };

    if (payload.address) {
      data.address = {
        upsert: {
          create: payload.address,
          update: payload.address,
          where: { userId: id },
        },
      };
    }

    if (payload.bankingDetails) {
      data.bankingDetails = {
        upsert: {
          create: payload.bankingDetails,
          update: payload.bankingDetails,
          where: { userId: id },
        },
      };
    }

    const result = await this.prismaService.user.update({
      data,
      where: { id },
      include: {
        address: true,
        bankingDetails: true,
      },
    });

    return result;
  }
}
