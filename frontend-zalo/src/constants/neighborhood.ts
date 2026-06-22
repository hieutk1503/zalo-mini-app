/**
 * Nhãn & meta cho module Cuộc họp và Nhóm cộng đồng (dữ liệu cấu hình mẫu).
 */
import { ConfirmStatus, GroupStatus, MeetingStatus } from "@dts";
import { BadgeMeta } from "./status";

export const MEETING_STATUS_META: Record<MeetingStatus, BadgeMeta> = {
    scheduled: { label: "Sắp diễn ra", color: "#0284C7", bg: "#E8F6FC" },
    ongoing: { label: "Đang diễn ra", color: "#F59E0B", bg: "#FFF7E6" },
    finished: { label: "Đã kết thúc", color: "#16A34A", bg: "#EAF8EF" },
    cancelled: { label: "Đã hủy", color: "#767A7F", bg: "#E9EBED" },
};

export const CONFIRM_STATUS_META: Record<ConfirmStatus, BadgeMeta> = {
    pending: { label: "Chưa xác nhận", color: "#F59E0B", bg: "#FFF7E6" },
    confirmed: { label: "Đã xác nhận", color: "#16A34A", bg: "#EAF8EF" },
    declined: { label: "Từ chối", color: "#DC2626", bg: "#FEECEC" },
};

export const GROUP_STATUS_META: Record<GroupStatus, BadgeMeta> = {
    active: { label: "Đang hoạt động", color: "#16A34A", bg: "#EAF8EF" },
    inactive: { label: "Ngừng", color: "#767A7F", bg: "#E9EBED" },
};

/** Chủ đề/loại nhóm cộng đồng (mẫu) */
export const GROUP_TOPICS: string[] = [
    "Tổ tự quản",
    "Vệ sinh môi trường",
    "Văn nghệ - thể thao",
    "Khuyến học",
    "An ninh trật tự",
    "Hỗ trợ cộng đồng",
    "Khác",
];
