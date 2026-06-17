import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProceduresService {
  constructor(private prisma: PrismaService) {}

  findAll(q?: string) {
    if (!q) {
      return this.prisma.administrativeProcedure.findMany({
        orderBy: { title: 'asc' },
      });
    }

    return this.prisma.administrativeProcedure.findMany({
      where: {
        title: { contains: q, mode: 'insensitive' },
      },
      orderBy: { title: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.administrativeProcedure.findUnique({ where: { id } });
  }
}
