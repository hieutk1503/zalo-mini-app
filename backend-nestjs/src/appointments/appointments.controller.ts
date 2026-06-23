import { Controller, Post, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { SoftAuthGuard } from '../auth/soft-auth.guard';
import { ZaloAuthGuard } from '../auth/zalo-auth.guard';
import { AdminAuthGuard } from '../admin-auth/admin-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { Citizen } from '@prisma/client';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @UseGuards(ZaloAuthGuard, SoftAuthGuard)
  async create(
    @CurrentUser() user: Citizen,
    @Body()
    data: {
      date: string;
      appointmentTime?: string;
      timeSlot?: string;
      content: string;
      fullName?: string;
      phoneNumber?: string;
      phone?: string;
      cccd?: string;
      citizenId?: string;
    },
  ) {
    const timeSlot = data.appointmentTime || data.timeSlot || '08:00';
    const phone = data.phoneNumber || data.phone;
    const cccd = data.cccd || data.citizenId;
    const result = await this.appointmentsService.createAppointment(user.id, {
      ...data,
      timeSlot,
      phone,
      cccd,
    });

    // Map to frontend interface CreateWorkScheduleResponse
    return {
      fullName: user.full_name || data.fullName,
      yourNumber: result.id,
      currentNumber: 1, // Mock current number
      date: result.appointment_date.toISOString().split('T')[0],
      content: result.content,
      phoneNumber: user.phone || data.phoneNumber,
      citizenId: user.cccd || data.cccd,
      appointmentTime: result.time_slot,
      code: result.ticket_number,
      organizationId: '',
      status: result.status.toLowerCase(),
    };
  }

  @Get()
  @UseGuards(ZaloAuthGuard, SoftAuthGuard)
  async findAll(@CurrentUser() user: Citizen) {
    const appointments = await this.appointmentsService.getMyAppointments(user.id);
    // Map to frontend interface GetWorkSchedulesResponse
    return {
      schedules: appointments.map(app => ({
        fullName: app.citizen.full_name,
        yourNumber: app.id,
        currentNumber: 1,
        date: app.appointment_date.toISOString().split('T')[0],
        content: app.content,
        phoneNumber: app.citizen.phone,
        citizenId: app.citizen.cccd,
        appointmentTime: app.time_slot,
        code: app.ticket_number,
        status: app.status.toLowerCase(),
        rejectedInfo: '',
      }))
    };
  }

}
