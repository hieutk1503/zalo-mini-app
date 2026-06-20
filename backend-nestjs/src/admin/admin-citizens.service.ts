import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminCitizensService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.citizen.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        appointments: true,
      }
    });
  }
}
