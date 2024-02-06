import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { pagination } from 'prisma-extension-pagination';

@Injectable()
export class PrismaService extends PrismaClient {
  public extendend = this.$extends(
    pagination({
      pages: {
        limit: 10,
        includePageCount: true,
      },
    }),
  );
}
