import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { SoftAuthGuard } from './soft-auth.guard';
import { ZaloAuthGuard } from './zalo-auth.guard';
import { ZaloAuthService } from './zalo-auth.service';

@Module({
  imports: [PrismaModule, HttpModule],
  providers: [ZaloAuthService, SoftAuthGuard, ZaloAuthGuard],
  exports: [SoftAuthGuard, ZaloAuthGuard, ZaloAuthService],
})
export class AuthModule {}
