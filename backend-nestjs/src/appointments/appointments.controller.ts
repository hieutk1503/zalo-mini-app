import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { SoftAuthGuard } from '../auth/soft-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { Citizen } from '@prisma/client';

@Controller('appointments')
@UseGuards(SoftAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(
    @CurrentUser() user: Citizen,
    @Body()
    data: {
      date: string;
      timeSlot: string;
      content: string;
      fullName?: string;
      phone?: string;
      cccd?: string;
    },
  ) {
    return this.appointmentsService.createAppointment(user.id, data);
  }

  @Get()
  async findAll(@CurrentUser() user: Citizen) {
    return this.appointmentsService.getMyAppointments(user.id);
  }
}
