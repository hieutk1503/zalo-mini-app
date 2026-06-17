import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminFeedbacksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.feedback.findMany({
      include: {
        citizen: {
          select: {
            full_name: true,
            phone: true,
            zalo_id: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async updateStatus(id: number, status: string, adminReply?: string) {
    const feedback = await this.prisma.feedback.findUnique({ where: { id } });
    if (!feedback) throw new NotFoundException('Phản ánh không tồn tại');

    return this.prisma.feedback.update({
      where: { id },
      data: {
        status,
        ...(adminReply !== undefined && { admin_reply: adminReply }),
      },
    });
  }
}
