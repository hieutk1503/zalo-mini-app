import React from "react";
import { Route } from "react-router-dom";
import { AnimationRoutes, ZMPRouter } from "zmp-ui";

import {
    FeedbackPage,
    FeedbackDetailPage,
    CreateFeedbackPage,
} from "./Feedback";
import { GuidelinesPage } from "./Guidelines";
import { HomePage } from "./Home";
import { InformationGuidePage } from "./InformationGuide";
import { CreateScheduleAppointmentPage } from "./CreateScheduleAppointment";
import { AppointmentScheduleResultPage } from "./AppointmentScheduleResult";
import { SearchPage } from "./Search";
import { ProfilePage } from "./Profile";
import { ProceduresPage, ProcedureDetailPage } from "./Procedures";
import { DocumentsPage, DocumentDetailPage } from "./Documents";
import {
    LegalLibraryPage,
    LegalDocumentDetailPage,
} from "./LegalLibrary";
import { AboutPage } from "./About";
import { HotlinesPage } from "./Hotlines";
import { LocationPage } from "./Location";
import { WorkSchedulePage } from "./WorkSchedule";
import { SurveyPage } from "./Survey";
import { ChatbotPage } from "./Chatbot";
import { PlanningPage } from "./Planning";
import { ProjectsPage, ProjectDetailPage } from "./Projects";
import { BiddingsPage, BiddingDetailPage } from "./Biddings";
import {
    ResidentsPage,
    ResidentDetailPage,
    ResidentFormPage,
} from "./Residents";
import {
    HouseholdsPage,
    HouseholdDetailPage,
    HouseholdFormPage,
} from "./Households";
import { ApprovalPage, ApprovalDetailPage } from "./Approval";
import { ReflectionsPage, ReflectionDetailPage } from "./Reflections";
import {
    NotificationsPage,
    NotificationDetailPage,
} from "./Notifications";
import {
    MeetingsPage,
    MeetingDetailPage,
    MeetingFormPage,
} from "./Meetings";
import {
    CommunityGroupsPage,
    CommunityGroupDetailPage,
    CommunityGroupFormPage,
} from "./CommunityGroups";
import { SurveysPage, SurveyDetailPage } from "./Surveys";
import { ContestsPage, ContestDetailPage } from "./Contests";
import { IncomePage, IncomeDetailPage, IncomeFormPage } from "./Income";
import { ExpensesPage, ExpenseDetailPage, ExpenseFormPage } from "./Expenses";
import { ServiceHubPage } from "./ServiceHub";
import {
    DashboardPage,
    ReportEntryPage,
    MeetingRoomPage,
} from "./Dashboard";
import { NewsPage, NewsDetailPage } from "./News";
import { EventDetailPage, EventsListPage } from "./Events";
import { AccountPage } from "./Account";
import { MyAppointmentsPage } from "./MyAppointments";
import { FormsPage } from "./Forms";
import {
    AdminLogin,
    AdminDashboard,
    AdminNews,
    AdminAppointments,
    AdminBidding,
    AdminCitizens,
    AdminDocuments,
    AdminFeedbacks,
    AdminFormTemplates,
    AdminImport,
    AdminInvestment,
    AdminPlanning,
    AdminProcedures,
    AdminWorkSchedule
} from "./Admin";

const Routes: React.FC = () => (
    <ZMPRouter>
        <AnimationRoutes>
            <Route path="/" element={<HomePage />} />
            <Route path="/guidelines" element={<GuidelinesPage />} />

            <Route path="/feedbacks" element={<FeedbackPage />} />
            <Route path="/feedbacks/:id" element={<FeedbackDetailPage />} />
            <Route path="/create-feedback" element={<CreateFeedbackPage />} />
            <Route
                path="/create-schedule-appointment"
                element={<CreateScheduleAppointmentPage />}
            />
            <Route
                path="/schedule-appointment-result"
                element={<AppointmentScheduleResultPage />}
            />
            <Route
                path="/information-guide"
                element={<InformationGuidePage />}
            />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/my-appointments" element={<MyAppointmentsPage />} />
            <Route path="/forms" element={<FormsPage />} />
            <Route path="/forms/:id" element={<DocumentDetailPage />} />

            {/* Module dịch vụ công mở rộng */}
            <Route path="/procedures" element={<ProceduresPage />} />
            <Route path="/procedures/:id" element={<ProcedureDetailPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/documents/:id" element={<DocumentDetailPage />} />
            <Route path="/legal-library" element={<LegalLibraryPage />} />
            <Route
                path="/legal-library/:id"
                element={<LegalDocumentDetailPage />}
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/hotlines" element={<HotlinesPage />} />
            <Route path="/location" element={<LocationPage />} />
            <Route path="/work-schedule" element={<WorkSchedulePage />} />
            <Route path="/survey" element={<SurveyPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/planning" element={<PlanningPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/biddings" element={<BiddingsPage />} />
            <Route path="/biddings/:id" element={<BiddingDetailPage />} />

            {/* eGov DSS / Resident Group - Cư dân */}
            <Route path="/residents" element={<ResidentsPage />} />
            <Route path="/residents/create" element={<ResidentFormPage />} />
            <Route path="/residents/:id" element={<ResidentDetailPage />} />
            <Route path="/residents/:id/edit" element={<ResidentFormPage />} />

            {/* eGov DSS / Resident Group - Hộ dân */}
            <Route path="/households" element={<HouseholdsPage />} />
            <Route path="/households/create" element={<HouseholdFormPage />} />
            <Route path="/households/:id" element={<HouseholdDetailPage />} />
            <Route
                path="/households/:id/edit"
                element={<HouseholdFormPage />}
            />

            {/* eGov DSS / Resident Group - Duyệt thông tin */}
            <Route
                path="/approval/residents"
                element={<ApprovalPage targetType="resident" />}
            />
            <Route
                path="/approval/households"
                element={<ApprovalPage targetType="household" />}
            />
            <Route
                path="/approval/detail/:id"
                element={<ApprovalDetailPage />}
            />

            {/* Phản ánh nâng cao (xử lý) */}
            <Route path="/reflections" element={<ReflectionsPage />} />
            <Route
                path="/reflections/:id"
                element={<ReflectionDetailPage />}
            />

            {/* Thông báo nhanh */}
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route
                path="/notifications/:id"
                element={<NotificationDetailPage />}
            />

            {/* Cuộc họp */}
            <Route path="/meetings" element={<MeetingsPage />} />
            <Route path="/meetings/create" element={<MeetingFormPage />} />
            <Route path="/meetings/:id" element={<MeetingDetailPage />} />

            {/* Nhóm cộng đồng */}
            <Route
                path="/community-groups"
                element={<CommunityGroupsPage />}
            />
            <Route
                path="/community-groups/create"
                element={<CommunityGroupFormPage />}
            />
            <Route
                path="/community-groups/:id"
                element={<CommunityGroupDetailPage />}
            />

            {/* Khảo sát (danh sách) */}
            <Route path="/surveys" element={<SurveysPage />} />
            <Route path="/surveys/:id" element={<SurveyDetailPage />} />

            {/* Cuộc thi */}
            <Route path="/contests" element={<ContestsPage />} />
            <Route path="/contests/:id" element={<ContestDetailPage />} />

            {/* Quản lý thu */}
            <Route path="/income" element={<IncomePage />} />
            <Route path="/income/create" element={<IncomeFormPage />} />
            <Route path="/income/:id" element={<IncomeDetailPage />} />

            {/* Quản lý chi */}
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/expenses/create" element={<ExpenseFormPage />} />
            <Route path="/expenses/:id" element={<ExpenseDetailPage />} />

            {/* Tiện ích / liên kết dịch vụ */}
            <Route path="/service-hub" element={<ServiceHubPage />} />

            {/* Tổng quan (DSS rút gọn) + trang TODO web admin */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/report-entry" element={<ReportEntryPage />} />
            <Route path="/meeting-room" element={<MeetingRoomPage />} />

            {/* Tin tức nội bộ (chi tiết + bình luận) */}
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />

            {/* Sự kiện (danh sách + chi tiết) */}
            <Route path="/events" element={<EventsListPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/news" element={<AdminNews />} />
            <Route path="/admin/appointments" element={<AdminAppointments />} />
            <Route path="/admin/bidding" element={<AdminBidding />} />
            <Route path="/admin/citizens" element={<AdminCitizens />} />
            <Route path="/admin/documents" element={<AdminDocuments />} />
            <Route path="/admin/feedbacks" element={<AdminFeedbacks />} />
            <Route path="/admin/form-templates" element={<AdminFormTemplates />} />
            <Route path="/admin/import" element={<AdminImport />} />
            <Route path="/admin/investment" element={<AdminInvestment />} />
            <Route path="/admin/planning" element={<AdminPlanning />} />
            <Route path="/admin/procedures" element={<AdminProcedures />} />
            <Route path="/admin/work-schedule" element={<AdminWorkSchedule />} />
        </AnimationRoutes>
    </ZMPRouter>
);

export default Routes;
