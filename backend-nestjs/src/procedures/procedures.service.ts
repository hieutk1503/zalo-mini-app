import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProceduresService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.administrativeProcedure.findMany();
  }

  findOne(id: number) {
    return this.prisma.administrativeProcedure.findUnique({ where: { id } });
  }
}
