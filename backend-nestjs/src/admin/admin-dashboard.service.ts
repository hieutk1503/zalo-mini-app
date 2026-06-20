import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const totalCitizens = await this.prisma.citizen.count();
    const totalFeedbacks = await this.prisma.feedback.count();
    const totalAppointments = await this.prisma.appointment.count();
    const totalNews = await this.prisma.news.count();

    const recentAppointments = await this.prisma.appointment.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: { citizen: true }
    });

    return {
      totalCitizens,
      totalFeedbacks,
      totalAppointments,
      totalNews,
      recentAppointments
    };
  }
}
