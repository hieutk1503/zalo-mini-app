import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkScheduleService {
  constructor(private prisma: PrismaService) {}

  create(createDto: any) {
    return this.prisma.workSchedule.create({ data: createDto });
  }

  findAll() {
    return this.prisma.workSchedule.findMany({ orderBy: { created_at: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.workSchedule.findUnique({ where: { id } });
  }

  update(id: number, updateDto: any) {
    return this.prisma.workSchedule.update({
      where: { id },
      data: updateDto,
    });
  }

  remove(id: number) {
    return this.prisma.workSchedule.delete({ where: { id } });
  }
}
