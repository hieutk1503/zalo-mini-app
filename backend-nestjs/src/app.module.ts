import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProceduresModule } from './procedures/procedures.module';
import { ChatModule } from './chat/chat.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { NewsModule } from './news/news.module';
import { DocumentsModule } from './documents/documents.module';
import { AiSyncModule } from './ai-sync/ai-sync.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { UploadModule } from './upload/upload.module';
import { AdminModule } from './admin/admin.module';
import { PlanningModule } from './planning/planning.module';
import { InvestmentModule } from './investment/investment.module';
import { BiddingModule } from './bidding/bidding.module';
import { WorkScheduleModule } from './work-schedule/work-schedule.module';
import { FormTemplateModule } from './form-template/form-template.module';
import { SurveyModule } from './survey/survey.module';

@Module({
  imports: [
    PrismaModule,
    ProceduresModule,
    ChatModule,
    AppointmentsModule,
    FeedbacksModule,
    NewsModule,
    DocumentsModule,
    AiSyncModule,
    AdminAuthModule,
    UploadModule,
    AdminModule,
    PlanningModule,
    InvestmentModule,
    BiddingModule,
    WorkScheduleModule,
    FormTemplateModule,
    SurveyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
