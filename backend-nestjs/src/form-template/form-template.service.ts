import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FormTemplateService {
  constructor(private prisma: PrismaService) {}

  create(createDto: any) {
    return this.prisma.formTemplate.create({ data: createDto });
  }

  findAll() {
    return this.prisma.formTemplate.findMany({ orderBy: { created_at: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.formTemplate.findUnique({ where: { id } });
  }

  update(id: number, updateDto: any) {
    return this.prisma.formTemplate.update({
      where: { id },
      data: updateDto,
    });
  }

  remove(id: number) {
    return this.prisma.formTemplate.delete({ where: { id } });
  }
}
