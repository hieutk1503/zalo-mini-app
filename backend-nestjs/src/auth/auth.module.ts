import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { SoftAuthGuard } from './soft-auth.guard';
import { ZaloAuthService } from './zalo-auth.service';

@Module({
  imports: [PrismaModule, HttpModule],
  providers: [ZaloAuthService, SoftAuthGuard],
  exports: [SoftAuthGuard, ZaloAuthService],
})
export class AuthModule {}
