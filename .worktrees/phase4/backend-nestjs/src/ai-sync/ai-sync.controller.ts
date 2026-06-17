import { Controller, Post } from '@nestjs/common';
import { AiSyncService } from './ai-sync.service';

@Controller('ai-sync')
export class AiSyncController {
  constructor(private readonly aiSyncService: AiSyncService) {}

  @Post('trigger-all')
  async triggerAll() {
    return this.aiSyncService.syncAllKnowledge();
  }
}
