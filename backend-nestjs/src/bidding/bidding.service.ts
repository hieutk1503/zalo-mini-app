import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BiddingService {
  constructor(private prisma: PrismaService) {}

  create(createDto: any) {
    return this.prisma.bidding.create({ data: createDto });
  }

  findAll() {
    return this.prisma.bidding.findMany({ orderBy: { created_at: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.bidding.findUnique({ where: { id } });
  }

  update(id: number, updateDto: any) {
    return this.prisma.bidding.update({
      where: { id },
      data: updateDto,
    });
  }

  remove(id: number) {
    return this.prisma.bidding.delete({ where: { id } });
  }
}
