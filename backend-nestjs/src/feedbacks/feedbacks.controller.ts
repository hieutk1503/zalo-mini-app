import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { SoftAuthGuard } from '../auth/soft-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { Citizen } from '@prisma/client';

@Controller('feedbacks')
@UseGuards(SoftAuthGuard)
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post()
  async create(
    @CurrentUser() user: Citizen,
    @Body() data: { content: string; imageUrls?: string },
  ) {
    return this.feedbacksService.createFeedback(user.id, data);
  }

  @Get()
  async findAll(@CurrentUser() user: Citizen) {
    return this.feedbacksService.getMyFeedbacks(user.id);
  }
}
