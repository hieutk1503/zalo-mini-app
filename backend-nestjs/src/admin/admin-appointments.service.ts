import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminAppointmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.appointment.findMany({
      include: {
        citizen: {
          select: {
            full_name: true,
            phone: true,
            zalo_id: true,
          },
        },
      },
      orderBy: [
        { appointment_date: 'asc' },
        { time_slot: 'asc' }
      ],
    });
  }

  async updateStatus(id: number, status: string) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new NotFoundException('Lịch hẹn không tồn tại');

    return this.prisma.appointment.update({
      where: { id },
      data: { status },
    });
  }
}
