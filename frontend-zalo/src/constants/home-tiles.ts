/**
 * Danh mục ô chức năng cho trang chủ mới (giao diện Chính quyền số).
 * - Ô có `path`: điều hướng tới module đã có trong app.
 * - Ô có `inDevelopment`: hiển thị mờ, gắn nhãn "Sắp ra mắt" (chưa có trang).
 * Mỗi ô dùng 1 emoji làm icon màu để không phụ thuộc bộ icon SVG.
 */
export interface HomeTile {
    key: string;
    label: string;
    emoji: string;
    path?: string;
    /** Liên kết ngoài (mở bằng Zalo webview) */
    link?: string;
    inDevelopment?: boolean;
}

/** Dành cho công dân — nối tới các module dịch vụ công sẵn có. */
export const CITIZEN_TILES: HomeTile[] = [
    { key: "procedures", label: "Dịch vụ công", emoji: "🏛️", path: "/procedures" },
    { key: "appointment", label: "Đặt lịch", emoji: "📆", path: "/create-schedule-appointment" },
    { key: "my-appointments", label: "Lịch hẹn của tôi", emoji: "🗒️", path: "/my-appointments" },
    { key: "search", label: "Tra cứu hồ sơ", emoji: "🔎", path: "/search" },
    { key: "feedbacks", label: "Phản ánh", emoji: "📢", path: "/feedbacks" },
    { key: "guidelines", label: "Hỏi đáp", emoji: "❓", path: "/guidelines" },
    { key: "documents", label: "Văn bản", emoji: "📄", path: "/documents" },
    { key: "legal-library", label: "Pháp luật", emoji: "📖", path: "/legal-library" },
    { key: "forms", label: "Mẫu đơn", emoji: "🧾", path: "/forms" },
    { key: "news", label: "Tin tức", emoji: "📰", path: "/news" },
    { key: "events", label: "Sự kiện", emoji: "🎉", path: "/events" },
    { key: "chatbot", label: "Trợ lý AI", emoji: "🤖", path: "/chatbot" },
    { key: "work-schedule", label: "Lịch công tác", emoji: "🗓️", path: "/work-schedule" },
    { key: "location", label: "Bản đồ trụ sở", emoji: "📍", path: "/location" },
    { key: "planning", label: "Quy hoạch", emoji: "🗺️", path: "/planning" },
    { key: "projects", label: "Dự án đầu tư", emoji: "🏗️", path: "/projects" },
    { key: "biddings", label: "Đấu thầu", emoji: "📑", path: "/biddings" },
    { key: "info-guide", label: "Thông tin - hướng dẫn", emoji: "📘", path: "/information-guide" },
    { key: "surveys", label: "Khảo sát", emoji: "📊", path: "/surveys" },
    { key: "satisfaction", label: "Đánh giá hài lòng", emoji: "😊", path: "/survey" },
    { key: "contests", label: "Cuộc thi", emoji: "🏆", path: "/contests" },
    { key: "service-hub", label: "Tiện ích", emoji: "🧩", path: "/service-hub" },
    { key: "about", label: "Giới thiệu", emoji: "ℹ️", path: "/about" },
    { key: "youtube", label: "YouTube Phường", emoji: "▶️", link: "https://www.youtube.com/" },
    { key: "edu", label: "Đào tạo & học tập", emoji: "📚", inDevelopment: true },
    { key: "tourism", label: "Văn hóa - Du lịch", emoji: "🏞️", inDevelopment: true },
    { key: "economy", label: "Kinh tế", emoji: "📈", inDevelopment: true },
];

/** Quản lý khu phố — module dành cho tổ trưởng/cán bộ (đã xây dựng). */
export const KHUPHO_TILES: HomeTile[] = [
    { key: "dashboard", label: "Tổng quan", emoji: "📈", path: "/dashboard" },
    { key: "residents", label: "Cư dân", emoji: "👤", path: "/residents" },
    { key: "households", label: "Hộ dân", emoji: "🏠", path: "/households" },
    { key: "approval", label: "Duyệt cư dân", emoji: "✅", path: "/approval/residents" },
    { key: "reflections", label: "Xử lý phản ánh", emoji: "🛠️", path: "/reflections" },
    { key: "notifications", label: "Thông báo", emoji: "🔔", path: "/notifications" },
    { key: "meetings", label: "Cuộc họp", emoji: "📅", path: "/meetings" },
    { key: "groups", label: "Nhóm cộng đồng", emoji: "👥", path: "/community-groups" },
    { key: "income", label: "Quản lý thu", emoji: "💰", path: "/income" },
    { key: "expenses", label: "Quản lý chi", emoji: "💸", path: "/expenses" },
];

/** Dành cho doanh nghiệp, tổ chức — sắp ra mắt. */
export const BUSINESS_TILES: HomeTile[] = [
    { key: "biz-policy", label: "Chính sách doanh nghiệp", emoji: "🏢", inDevelopment: true },
    { key: "biz-service", label: "Dịch vụ doanh nghiệp", emoji: "🧑‍💼", inDevelopment: true },
    { key: "smart-city", label: "Đô thị thông minh", emoji: "🌆", inDevelopment: true },
    { key: "legal-support", label: "Hỗ trợ pháp lý", emoji: "⚖️", inDevelopment: true },
];
