import { Module } from '@nestjs/common';
import { HomeSectionsController } from './home-sections.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HomeSectionsController],
})
export class HomeSectionsModule {}
