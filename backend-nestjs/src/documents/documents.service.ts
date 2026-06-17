import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  findAll(type?: string, q?: string) {
    const where: Prisma.DocumentWhereInput = {};
    if (type) {
      where.type = type;
    }
    if (q) {
      where.OR = [
        { document_no: { contains: q, mode: 'insensitive' } },
        { abstract: { contains: q, mode: 'insensitive' } },
      ];
    }
    return this.prisma.document.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: 20,
    });
  }

  findOne(id: number) {
    return this.prisma.document.findUnique({
      where: { id },
    });
  }
}
