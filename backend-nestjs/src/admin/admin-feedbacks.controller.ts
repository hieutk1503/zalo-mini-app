import { Controller, Get, Patch, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AdminFeedbacksService } from './admin-feedbacks.service';
import { AdminAuthGuard } from '../admin-auth/admin-auth.guard';

@Controller('admin/feedbacks')
@UseGuards(AdminAuthGuard)
export class AdminFeedbacksController {
  constructor(private readonly adminFeedbacksService: AdminFeedbacksService) {}

  @Get()
  findAll() {
    return this.adminFeedbacksService.findAll();
  }

  @Patch(':id')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: string; admin_reply?: string },
  ) {
    return this.adminFeedbacksService.updateStatus(
      id,
      body.status,
      body.admin_reply,
    );
  }
}
