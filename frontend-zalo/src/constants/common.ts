export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const MINI_APP_ID =
    window.APP_ID || (import.meta.env.VITE_MINI_APP_ID as string);
export const API = {
    GET_ORGANIZATION: "/organization",
    SEARCH_PROFILES: "/search_profiles_api",
    GET_ARTICLES: "/news",
    FEEDBACK: "/feedback_api",
    FEEDBACK_TYPES: "/feedback_types_api",
    INFORMATION_GUIDE: "/information_guide_api",
    UPLOAD_IMAGE: "/upload_image_api",
    CREATE_SCHEDULE: "/create_schedule_api",
    GET_SCHEDULE: "/get_schedule_api",
    GET_SCHEDULES: "/schedules_api",
    WEATHER: "/weather",
    HOME_SECTIONS: "/home-sections",
    EVENTS: "/events",
    EVENT_DETAIL: "/events_api/:id",
    // Module dịch vụ công mở rộng
    PROCEDURES: "/procedures_api",
    PROCEDURE_DETAIL: "/procedures_api/:id",
    DOCUMENTS: "/documents_api",
    DOCUMENT_DETAIL: "/documents_api/:id",
    LEGAL_DOCUMENTS: "/legal_documents_api",
    LEGAL_DOCUMENT_DETAIL: "/legal_documents_api/:id",
    HOME_STATS: "/home_stats_api",
    HOTLINES: "/hotlines_api",
    OFFICE_LOCATIONS: "/office_locations_api",
    WORK_SCHEDULE: "/work_schedule_api",
    SURVEY: "/survey_api",
    SUBMIT_SURVEY: "/survey_api/submit",
    CHATBOT_SESSIONS: "/chatbot/sessions",
    CHATBOT_MESSAGES: "/chatbot/messages",
    PROJECTS: "/projects_api",
    PROJECT_DETAIL: "/projects_api/:id",
    BIDDINGS: "/biddings_api",
    BIDDING_DETAIL: "/biddings_api/:id",
    // eGov DSS / Resident Group
    RESIDENTS: "/residents",
    RESIDENT_DETAIL: "/residents/:id",
    HOUSEHOLDS: "/households",
    HOUSEHOLD_DETAIL: "/households/:id",
    HOUSEHOLD_MEMBERS: "/households/:id/members",
    APPROVAL_REQUESTS: "/approval-requests",
    APPROVAL_REQUEST_DETAIL: "/approval-requests/:id",
    NEIGHBORHOOD_GROUPS: "/neighborhood-groups",
    // Phản ánh nâng cao (xử lý)
    REFLECTIONS: "/reflections",
    REFLECTION_DETAIL: "/reflections/:id",
    // Thông báo nhanh
    QUICK_NOTIFICATIONS: "/notifications",
    QUICK_NOTIFICATION_DETAIL: "/notifications/:id",
    // Cuộc họp
    MEETINGS: "/meetings",
    MEETING_DETAIL: "/meetings/:id",
    // Nhóm cộng đồng
    COMMUNITY_GROUPS: "/community-groups",
    COMMUNITY_GROUP_DETAIL: "/community-groups/:id",
    // Khảo sát (danh sách)
    SURVEY_CAMPAIGNS: "/surveys",
    SURVEY_CAMPAIGN_DETAIL: "/surveys/:id",
    SURVEY_CAMPAIGN_RESULT: "/surveys/:id/results",
    // Cuộc thi
    CONTESTS: "/contests",
    CONTEST_DETAIL: "/contests/:id",
    CONTEST_RANKING: "/contests/:id/ranking",
    // Quản lý thu
    INCOME_CAMPAIGNS: "/income-campaigns",
    INCOME_CAMPAIGN_DETAIL: "/income-campaigns/:id",
    INCOME_PAYMENT_STATUS: "/income-campaigns/:id/payment-status",
    // Quản lý chi
    EXPENSES: "/expenses",
    EXPENSE_DETAIL: "/expenses/:id",
    // Tiện ích / liên kết
    SERVICE_LINKS: "/service-links",
    // Tin tức nội bộ
    NEWS: "/news",
    NEWS_DETAIL: "/news/:id",
    NEWS_COMMENTS: "/news/:id/comments",
    NEWS_CATEGORIES_API: "/news-categories",
    // Upload tệp
    UPLOADS: "/uploads",
};

/** Tập trung đường dẫn các trang để tránh hardcode rải rác */
export const ROUTES = {
    HOME: "/",
    PROCEDURES: "/procedures",
    PROCEDURE_DETAIL: "/procedures/:id",
    DOCUMENTS: "/documents",
    DOCUMENT_DETAIL: "/documents/:id",
    LEGAL_LIBRARY: "/legal-library",
    LEGAL_LIBRARY_DETAIL: "/legal-library/:id",
    ABOUT: "/about",
    HOTLINES: "/hotlines",
    LOCATION: "/location",
    WORK_SCHEDULE: "/work-schedule",
    SURVEY: "/survey",
    CHATBOT: "/chatbot",
    PLANNING: "/planning",
    PROJECTS: "/projects",
    PROJECT_DETAIL: "/projects/:id",
    BIDDINGS: "/biddings",
    BIDDING_DETAIL: "/biddings/:id",
    FEEDBACKS: "/feedbacks",
    CREATE_FEEDBACK: "/create-feedback",
    CREATE_SCHEDULE: "/create-schedule-appointment",
    SEARCH: "/search",
    INFORMATION_GUIDE: "/information-guide",
    // eGov DSS / Resident Group
    RESIDENTS: "/residents",
    RESIDENT_DETAIL: "/residents/:id",
    RESIDENT_CREATE: "/residents/create",
    HOUSEHOLDS: "/households",
    HOUSEHOLD_DETAIL: "/households/:id",
    HOUSEHOLD_CREATE: "/households/create",
    APPROVAL_RESIDENTS: "/approval/residents",
    APPROVAL_HOUSEHOLDS: "/approval/households",
    REFLECTIONS: "/reflections",
    REFLECTION_DETAIL: "/reflections/:id",
    NOTIFICATIONS: "/notifications",
    NOTIFICATION_DETAIL: "/notifications/:id",
    MEETINGS: "/meetings",
    MEETING_DETAIL: "/meetings/:id",
    MEETING_CREATE: "/meetings/create",
    COMMUNITY_GROUPS: "/community-groups",
    COMMUNITY_GROUP_DETAIL: "/community-groups/:id",
    COMMUNITY_GROUP_CREATE: "/community-groups/create",
    SURVEYS: "/surveys",
    SURVEY_DETAIL: "/surveys/:id",
    CONTESTS: "/contests",
    CONTEST_DETAIL: "/contests/:id",
    INCOME: "/income",
    INCOME_DETAIL: "/income/:id",
    INCOME_CREATE: "/income/create",
    EXPENSES: "/expenses",
    EXPENSE_DETAIL: "/expenses/:id",
    EXPENSE_CREATE: "/expenses/create",
    SERVICE_HUB: "/service-hub",
    DASHBOARD: "/dashboard",
    REPORT_ENTRY: "/report-entry",
    MEETING_ROOM: "/meeting-room",
    NEWS: "/news",
    NEWS_DETAIL: "/news/:id",
};
export const SEARCH_NOT_FOUND = "Không tìm thấy thông tin";

export const TOTAL_ARTICLES_PER_PAGE = 10;
export const TOTAL_FEEDBACKS_PER_PAGE = 10;
export const TOTAL_INFORMATION_GUIDE_PER_PAGE = 10;
export const TOTAL_PROCEDURES_PER_PAGE = 10;
export const TOTAL_DOCUMENTS_PER_PAGE = 10;
export const TOTAL_LEGAL_DOCUMENTS_PER_PAGE = 10;

/** Lĩnh vực văn bản pháp luật (bộ lọc Thư viện pháp luật) */
export const LEGAL_FIELDS = [
    "Hộ tịch - Cư trú",
    "Đất đai",
    "Chứng thực",
    "Kinh doanh - Hộ kinh doanh",
    "Lao động - Việc làm",
    "Bảo hiểm xã hội - Y tế",
    "Xây dựng",
    "Môi trường",
    "An sinh xã hội - Người có công",
];

/** Loại văn bản pháp luật */
export const LEGAL_DOC_TYPES = [
    "Luật",
    "Nghị định",
    "Thông tư",
    "Quyết định",
    "Nghị quyết",
    "Công văn",
];

/** Nhãn trạng thái hiệu lực */
export const LEGAL_STATUS_LABEL: Record<string, string> = {
    active: "Còn hiệu lực",
    expired: "Hết hiệu lực",
    amended: "Sửa đổi, bổ sung",
};
export const TOTAL_RESIDENTS_PER_PAGE = 10;
export const TOTAL_HOUSEHOLDS_PER_PAGE = 10;
export const TOTAL_APPROVALS_PER_PAGE = 10;
export const TOTAL_REFLECTIONS_PER_PAGE = 10;
export const TOTAL_NOTIFICATIONS_PER_PAGE = 10;
export const TOTAL_MEETINGS_PER_PAGE = 10;
export const TOTAL_GROUPS_PER_PAGE = 10;
export const TOTAL_SURVEYS_PER_PAGE = 10;
export const TOTAL_CONTESTS_PER_PAGE = 10;
export const TOTAL_INCOME_PER_PAGE = 20;
export const TOTAL_EXPENSES_PER_PAGE = 20;
export const TOTAL_NEWS_PER_PAGE = 10;

/** Chuyên mục tin tức (mẫu) */
export const NEWS_CATEGORIES = [
    "Hoạt động khu phố",
    "Thông báo",
    "Chính sách",
    "An sinh xã hội",
    "Sự kiện",
];

/** Khung giờ làm việc mặc định cho đặt lịch (có thể cấu hình từ backend) */
export const APPOINTMENT_TIME_SLOTS = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
];

export const SCHEDULE_APPOINTMENT_STATUS = {
    PENDING: "pending",
    REJECTED: "rejected",
    APPROVED: "approved",
};

export const MAX_FEEDBACK_IMAGES = 4;
