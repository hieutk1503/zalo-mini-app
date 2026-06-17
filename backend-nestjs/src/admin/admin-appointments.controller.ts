import { Controller, Get, Patch, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AdminAppointmentsService } from './admin-appointments.service';
import { AdminAuthGuard } from '../admin-auth/admin-auth.guard';

@Controller('admin/appointments')
@UseGuards(AdminAuthGuard)
export class AdminAppointmentsController {
  constructor(private readonly adminAppointmentsService: AdminAppointmentsService) {}

  @Get()
  findAll() {
    return this.adminAppointmentsService.findAll();
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return this.adminAppointmentsService.updateStatus(id, status);
  }
}
