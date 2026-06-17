import { Module } from '@nestjs/common';
import { AdminFeedbacksController } from './admin-feedbacks.controller';
import { AdminFeedbacksService } from './admin-feedbacks.service';
import { AdminAppointmentsController } from './admin-appointments.controller';
import { AdminAppointmentsService } from './admin-appointments.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminAuthModule } from '../admin-auth/admin-auth.module';

@Module({
  imports: [PrismaModule, AdminAuthModule],
  controllers: [AdminFeedbacksController, AdminAppointmentsController],
  providers: [AdminFeedbacksService, AdminAppointmentsService]
})
export class AdminModule {}
