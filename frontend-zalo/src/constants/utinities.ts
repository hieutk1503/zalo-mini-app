import * as Icon from "@components/icons";
import { Utinity } from "@dts";
import SocialInsuranceLogo from "@assets/logo-social-insurance.png";
import Youtube from "@assets/youtube.png";
import Location from "@assets/location.png";
import Identification from "@assets/id-card.png";
import InternalPhone from "@assets/internal-phone.png";
import SocialInsurranceNumber from "@assets/social-insurance-number.png";
import Benefit from "@assets/benefits.png";
import Renew from "@assets/files.png";

/**
 * Nhóm "Quản lý khu phố" (eGov DSS / Resident Group) — hiển thị thành một
 * section riêng trên trang chủ để tránh dồn tất cả vào một lưới quá dài.
 */
export const RESIDENT_GROUP_UTINITIES: Array<Utinity> = [
    {
        key: "dashboard",
        label: "Tổng quan",
        icon: Icon.DashboardIcon,
        path: "/dashboard",
    },
    {
        key: "residents",
        label: "Cư dân",
        icon: Icon.ResidentsIcon,
        path: "/residents",
    },
    {
        key: "households",
        label: "Hộ dân",
        icon: Icon.HouseholdIcon,
        path: "/households",
    },
    {
        key: "approval-residents",
        label: "Duyệt cư dân",
        icon: Icon.ApprovalIcon,
        path: "/approval/residents",
    },
    {
        key: "approval-households",
        label: "Duyệt hộ dân",
        icon: Icon.ApprovalIcon,
        path: "/approval/households",
    },
    {
        key: "reflections",
        label: "Xử lý phản ánh",
        icon: Icon.ReflectionIcon,
        path: "/reflections",
    },
    {
        key: "notifications",
        label: "Thông báo",
        icon: Icon.NotificationIcon,
        path: "/notifications",
    },
    {
        key: "meetings",
        label: "Cuộc họp",
        icon: Icon.MeetingIcon,
        path: "/meetings",
    },
    {
        key: "community-groups",
        label: "Nhóm cộng đồng",
        icon: Icon.GroupIcon,
        path: "/community-groups",
    },
    {
        key: "surveys",
        label: "Khảo sát",
        icon: Icon.SurveyIcon,
        path: "/surveys",
    },
    {
        key: "contests",
        label: "Cuộc thi",
        icon: Icon.ContestIcon,
        path: "/contests",
    },
    {
        key: "income",
        label: "Quản lý thu",
        icon: Icon.IncomeIcon,
        path: "/income",
    },
    {
        key: "expenses",
        label: "Quản lý chi",
        icon: Icon.ExpenseIcon,
        path: "/expenses",
    },
];

export const APP_UTINITIES: Array<Utinity> = [
    {
        key: "chatbot",
        label: "Trợ lý dịch vụ công",
        icon: Icon.PersonalIcon,
        path: "/chatbot",
    },
    {
        key: "procedures",
        label: "Thủ tục hành chính",
        icon: Icon.BookIcon,
        path: "/procedures",
    },
    {
        key: "create-schedule-appointment",
        label: "Đặt lịch làm việc",
        icon: Icon.CalendarIcon,
        path: "/create-schedule-appointment",
    },
    {
        key: "documents",
        label: "Văn bản - mẫu đơn",
        icon: Icon.ProfileIcon,
        path: "/documents",
    },
    {
        key: "legal-library",
        label: "Thư viện pháp luật",
        icon: Icon.BookIcon,
        path: "/legal-library",
    },
    {
        key: "forms",
        label: "Mẫu đơn, tờ khai",
        icon: Icon.PenIcon,
        path: "/documents",
        navState: { type: "form" },
    },
    {
        key: "feedback",
        label: "Góp ý - phản ánh",
        icon: Icon.PenIcon,
        path: "/feedbacks",
    },
    {
        key: "file-search",
        label: "Tra cứu hồ sơ",
        icon: Icon.SearchIcon,
        path: "/search",
    },
    {
        key: "hotlines",
        label: "Đường dây nóng",
        icon: Icon.HeadphoneIcon,
        path: "/hotlines",
    },
    {
        key: "work-schedule",
        label: "Lịch công tác",
        icon: Icon.ClockIcon,
        path: "/work-schedule",
    },
    {
        key: "location",
        label: "Bản đồ - Trụ sở",
        icon: Icon.GlobeIcon,
        path: "/location",
    },
    {
        key: "survey",
        label: "Khảo sát hài lòng",
        icon: Icon.QAndAIcon,
        path: "/survey",
    },
    {
        key: "planning",
        label: "Thông tin quy hoạch",
        icon: Icon.ImageIcon,
        path: "/planning",
    },
    {
        key: "projects",
        label: "Dự án đầu tư",
        icon: Icon.EnterpriseIcon,
        path: "/projects",
    },
    {
        key: "biddings",
        label: "Thông tin đấu thầu",
        icon: Icon.NotificationIcon,
        path: "/biddings",
    },
    {
        key: "news",
        label: "Tin tức",
        icon: Icon.NewsIcon,
        path: "/news",
    },
    {
        key: "service-hub",
        label: "Tiện ích - Liên kết",
        icon: Icon.ServiceHubIcon,
        path: "/service-hub",
    },
    {
        key: "info",
        label: "Thông tin - hướng dẫn",
        icon: Icon.HeadsetIcon,
        path: "/information-guide",
    },
    {
        key: "about",
        label: "Giới thiệu",
        icon: Icon.EnterpriseIcon,
        path: "/about",
    },
    {
        key: "youtube",
        label: "YouTube Phường",
        icon: Icon.NewsIcon,
        link: "https://www.youtube.com/",
    },
    {
        key: "goverment",
        label: "Cổng DVC quốc gia",
        icon: Icon.EnterpriseIcon,
        link: "https://dichvucong.gov.vn/",
    },
];

export const CONTACTS: Array<Utinity> = [
    {
        key: "social-insurance",
        label: "BHXH TP Thủ Đức",
        link: "",
        iconSrc: SocialInsuranceLogo,
    },
    {
        key: "si-number",
        label: "Số tài khoản Thu BHXH",
        link: "",
        iconSrc: SocialInsurranceNumber,
    },
    {
        key: "internal-number",
        label: "Số nội bộ tổ nghiệp vụ",
        link: "",
        iconSrc: InternalPhone,
    },
    {
        key: "department",
        label: "Điểm thu BHXH, BHYT",
        link: "",
        iconSrc: Location,
    },
    {
        key: "update-identification",
        label: "Cập nhật Mã định danh / CCCD",
        link: "",
        iconSrc: Identification,
    },
    {
        key: "youtube",
        label: "Youtube",
        link: "",
        iconSrc: Youtube,
    },
];

export const PROCEDURES: Array<Utinity> = [
    {
        key: "renew",
        label: "Gia hạn thẻ BHYT trực tuyến",
        link: "",
        iconSrc: Renew,
    },
    {
        key: "benefit",
        label: "Các chế độ BHXH",
        link: "",
        iconSrc: Benefit,
    },
];
