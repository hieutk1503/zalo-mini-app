import { Module } from '@nestjs/common';
import { AiSyncService } from './ai-sync.service';
import { AiSyncController } from './ai-sync.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [HttpModule],
  providers: [AiSyncService, PrismaService],
  controllers: [AiSyncController],
})
export class AiSyncModule {}
