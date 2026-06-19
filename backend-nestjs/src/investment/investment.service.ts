import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvestmentService {
  constructor(private prisma: PrismaService) {}

  create(createDto: any) {
    return this.prisma.investmentProject.create({ data: createDto });
  }

  findAll() {
    return this.prisma.investmentProject.findMany({ orderBy: { created_at: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.investmentProject.findUnique({ where: { id } });
  }

  update(id: number, updateDto: any) {
    return this.prisma.investmentProject.update({
      where: { id },
      data: updateDto,
    });
  }

  remove(id: number) {
    return this.prisma.investmentProject.delete({ where: { id } });
  }
}
