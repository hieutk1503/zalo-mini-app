"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const procedures_module_1 = require("./procedures/procedures.module");
const chat_module_1 = require("./chat/chat.module");
const appointments_module_1 = require("./appointments/appointments.module");
const feedbacks_module_1 = require("./feedbacks/feedbacks.module");
const news_module_1 = require("./news/news.module");
const documents_module_1 = require("./documents/documents.module");
const ai_sync_module_1 = require("./ai-sync/ai-sync.module");
const admin_auth_module_1 = require("./admin-auth/admin-auth.module");
const upload_module_1 = require("./upload/upload.module");
const admin_module_1 = require("./admin/admin.module");
const planning_module_1 = require("./planning/planning.module");
const investment_module_1 = require("./investment/investment.module");
const bidding_module_1 = require("./bidding/bidding.module");
const work_schedule_module_1 = require("./work-schedule/work-schedule.module");
const form_template_module_1 = require("./form-template/form-template.module");
const survey_module_1 = require("./survey/survey.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            procedures_module_1.ProceduresModule,
            chat_module_1.ChatModule,
            appointments_module_1.AppointmentsModule,
            feedbacks_module_1.FeedbacksModule,
            news_module_1.NewsModule,
            documents_module_1.DocumentsModule,
            ai_sync_module_1.AiSyncModule,
            admin_auth_module_1.AdminAuthModule,
            upload_module_1.UploadModule,
            admin_module_1.AdminModule,
            planning_module_1.PlanningModule,
            investment_module_1.InvestmentModule,
            bidding_module_1.BiddingModule,
            work_schedule_module_1.WorkScheduleModule,
            form_template_module_1.FormTemplateModule,
            survey_module_1.SurveyModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map