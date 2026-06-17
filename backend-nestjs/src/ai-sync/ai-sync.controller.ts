import { Controller, Post, UseGuards } from '@nestjs/common';
import { AiSyncService } from './ai-sync.service';
import { AdminAuthGuard } from '../admin-auth/admin-auth.guard';

@Controller('ai-sync')
@UseGuards(AdminAuthGuard)
export class AiSyncController {
  constructor(private readonly aiSyncService: AiSyncService) {}

  @Post('trigger-all')
  async triggerAll() {
    return this.aiSyncService.syncAllKnowledge();
  }
}
