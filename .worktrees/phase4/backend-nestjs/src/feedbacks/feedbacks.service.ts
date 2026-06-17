import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedbacksService {
  constructor(private prisma: PrismaService) {}

  async createFeedback(
    citizenId: number,
    data: { content: string; imageUrls?: string },
  ) {
    return this.prisma.feedback.create({
      data: {
        citizen_id: citizenId,
        content: data.content,
        image_urls: data.imageUrls,
        status: 'NEW',
      },
    });
  }

  async getMyFeedbacks(citizenId: number) {
    return this.prisma.feedback.findMany({
      where: { citizen_id: citizenId },
      orderBy: { created_at: 'desc' },
    });
  }
}
