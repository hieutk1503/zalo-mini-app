import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async createAppointment(
    citizenId: number,
    data: {
      date: string;
      timeSlot: string;
      content: string;
      fullName?: string;
      phone?: string;
      cccd?: string;
    },
  ) {
    const citizenData = {
      ...(data.fullName?.trim() ? { full_name: data.fullName.trim() } : {}),
      ...(data.phone?.trim() ? { phone: data.phone.trim() } : {}),
      ...(data.cccd?.trim() ? { cccd: data.cccd.trim() } : {}),
    };

    if (Object.keys(citizenData).length > 0) {
      await this.prisma.citizen.update({
        where: { id: citizenId },
        data: citizenData,
      });
    }

    const ticketNumber = await this.generateTicketNumber();
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

  private async generateTicketNumber() {
    for (let attempt = 0; attempt < 10; attempt++) {
      const ticketNumber = `TL-${new Date().getFullYear()}-${Math.floor(
        100000 + Math.random() * 900000,
      )}`;
      const exists = await this.prisma.appointment.findUnique({
        where: { ticket_number: ticketNumber },
      });
      if (!exists) return ticketNumber;
    }

    throw new Error('Không thể sinh mã phiếu hẹn duy nhất');
  }

  async getMyAppointments(citizenId: number) {
    return this.prisma.appointment.findMany({
      where: { citizen_id: citizenId },
      orderBy: { created_at: 'desc' },
    });
  }
}
