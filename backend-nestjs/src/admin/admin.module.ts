import { Module } from '@nestjs/common';
import { AdminFeedbacksService } from './admin-feedbacks.service';
import { AdminFeedbacksController } from './admin-feedbacks.controller';
import { AdminAppointmentsService } from './admin-appointments.service';
import { AdminAppointmentsController } from './admin-appointments.controller';
import { AdminCitizensService } from './admin-citizens.service';
import { AdminCitizensController } from './admin-citizens.controller';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminDashboardController } from './admin-dashboard.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminAuthModule } from '../admin-auth/admin-auth.module';

@Module({
  imports: [PrismaModule, AdminAuthModule],
  controllers: [
    AdminFeedbacksController,
    AdminAppointmentsController,
    AdminCitizensController,
    AdminDashboardController
  ],
  providers: [
    AdminFeedbacksService,
    AdminAppointmentsService,
    AdminCitizensService,
    AdminDashboardService
  ],
})
export class AdminModule {}
