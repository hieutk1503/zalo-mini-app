import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  private normalizeSearch(value?: string | null) {
    return (value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\u0111/g, 'd')
      .replace(/\u0110/g, 'D')
      .toLowerCase();
  }

  async findAll(type?: string, q?: string) {
    const where: Prisma.DocumentWhereInput = {};
    if (type) {
      where.type = type;
    }

    const documents = await this.prisma.document.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    if (!q) return documents.slice(0, 20);

    const normalizedQuery = this.normalizeSearch(q);
    return documents
      .filter((document) =>
        this.normalizeSearch(
          [document.document_no, document.abstract, document.type].join(' '),
        ).includes(normalizedQuery),
      )
      .slice(0, 20);
  }

  findOne(id: number) {
    return this.prisma.document.findUnique({
      where: { id },
    });
  }

  create(data: any) {
    return this.prisma.document.create({ data });
  }

  update(id: number, data: any) {
    return this.prisma.document.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.document.delete({
      where: { id },
    });
  }
}

