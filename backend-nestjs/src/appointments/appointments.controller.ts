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
  @UseGuards(ZaloAuthGuard, SoftAuthGuard)
  async findAll(@CurrentUser() user: Citizen) {
    return this.appointmentsService.getMyAppointments(user.id);
  }

}
