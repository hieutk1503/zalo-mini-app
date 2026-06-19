import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SurveyService {
  constructor(private prisma: PrismaService) {}

  create(createDto: any) {
    return this.prisma.survey.create({ data: createDto });
  }

  findAll() {
    return this.prisma.survey.findMany({ orderBy: { created_at: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.survey.findUnique({ where: { id } });
  }

  update(id: number, updateDto: any) {
    return this.prisma.survey.update({
      where: { id },
      data: updateDto,
    });
  }

  remove(id: number) {
    return this.prisma.survey.delete({ where: { id } });
  }
}
