import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { SoftAuthGuard } from '../auth/soft-auth.guard';
import { ZaloAuthGuard } from '../auth/zalo-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { Citizen } from '@prisma/client';

@Controller('feedbacks')
@UseGuards(ZaloAuthGuard, SoftAuthGuard)
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post()
  async create(
    @CurrentUser() user: Citizen,
    @Body()
    data: { content: string; imageUrls?: string | string[]; location?: string; title?: string; feedbackTypeId?: number },
  ) {
    const imagesStr = Array.isArray(data.imageUrls)
      ? data.imageUrls.join(',')
      : data.imageUrls;

    return this.feedbacksService.createFeedback(user.id, {
      ...data,
      imageUrls: imagesStr,
    });
  }

  @Get()
  async findAll(@CurrentUser() user: Citizen) {
    const feedbacks = await this.feedbacksService.getMyFeedbacks(user.id);
    
    return {
      current: 1,
      pageSize: 10,
      total: feedbacks.length,
      data: feedbacks.map(f => ({
        id: f.id,
        title: 'Phản ánh #' + f.id,
        content: f.content,
        response: f.admin_reply,
        creationTime: f.created_at.getTime(),
        responseTime: f.created_at.getTime(),
        type: f.status,
        imageUrls: f.image_urls ? f.image_urls.split(',') : [],
      }))
    };
  }
}
