import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { AiSyncModule } from '../ai-sync/ai-sync.module';

@Module({
  imports: [AiSyncModule],
  providers: [NewsService],
  controllers: [NewsController],
})
export class NewsModule {}
