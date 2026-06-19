import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlanningService {
  constructor(private prisma: PrismaService) {}

  create(createDto: any) {
    return this.prisma.planning.create({ data: createDto });
  }

  findAll() {
    return this.prisma.planning.findMany({ orderBy: { created_at: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.planning.findUnique({ where: { id } });
  }

  update(id: number, updateDto: any) {
    return this.prisma.planning.update({
      where: { id },
      data: updateDto,
    });
  }

  remove(id: number) {
    return this.prisma.planning.delete({ where: { id } });
  }
}
