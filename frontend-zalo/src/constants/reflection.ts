/**
 * Danh mục & nhãn cho module Phản ánh nâng cao và Thông báo nhanh.
 * Dữ liệu cấu hình MẪU — thực tế lấy theo địa bàn từ backend.
 */
import { NotificationLevel, ReflectionStatus } from "@dts";

/** Đơn vị có thể chuyển tiếp phản ánh */
export const FORWARD_UNITS: string[] = [
    "UBND phường",
    "Công an phường",
    "Địa chính - Xây dựng",
    "Văn hóa - Xã hội",
    "Y tế phường",
    "Môi trường - Đô thị",
];

/** Loại phản ánh (mẫu) */
export const REFLECTION_TYPES: string[] = [
    "An ninh trật tự",
    "Hạ tầng - giao thông",
    "Môi trường - vệ sinh",
    "Điện - nước - chiếu sáng",
    "Thủ tục hành chính",
    "Khác",
];

/** Nhãn trạng thái phản ánh (badge lấy màu theo WorkflowStatus). */
export const REFLECTION_STATUS_LABEL: Record<ReflectionStatus, string> = {
    pending: "Chờ xử lý",
    processing: "Đang xử lý",
    forwarded: "Chuyển tiếp",
    completed: "Đã xử lý",
    rejected: "Từ chối",
};

/** Mức độ thông báo: nhãn + màu hex (chữ/nền) cho badge. */
export interface NotificationLevelMeta {
    label: string;
    color: string;
    bg: string;
}

export const NOTIFICATION_LEVEL_META: Record<
    NotificationLevel,
    NotificationLevelMeta
> = {
    normal: { label: "Thường", color: "#0284C7", bg: "#E8F6FC" },
    important: { label: "Quan trọng", color: "#F59E0B", bg: "#FFF7E6" },
    urgent: { label: "Khẩn", color: "#DC2626", bg: "#FEECEC" },
};
