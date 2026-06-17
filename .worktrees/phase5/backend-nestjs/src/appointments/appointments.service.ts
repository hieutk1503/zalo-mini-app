import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async createAppointment(
    citizenId: number,
    data: { date: string; timeSlot: string; content: string },
  ) {
    const ticketNumber = `TL-${Math.floor(1000 + Math.random() * 9000)}`;
    return this.prisma.appointment.create({
      data: {
        ticket_number: ticketNumber,
        citizen_id: citizenId,
        appointment_date: new Date(data.date),
        time_slot: data.timeSlot,
        content: data.content,
        status: 'PENDING',
      },
    });
  }

  async getMyAppointments(citizenId: number) {
    return this.prisma.appointment.findMany({
      where: { citizen_id: citizenId },
      orderBy: { created_at: 'desc' },
    });
  }
}
