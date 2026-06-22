/**
 * Trạng thái nghiệp vụ dùng chung cho các module phê duyệt / xử lý.
 * Màu sắc & nhãn lấy theo `docs/egov-dss-ui-design-system.md` (mục 4).
 *
 * Dùng mã hex trực tiếp (không qua class Tailwind) để StatusBadge luôn render
 * đúng màu, tránh phụ thuộc việc twin.macro phân tích class động.
 */

export type WorkflowStatus =
    | "draft"
    | "pending"
    | "approved"
    | "rejected"
    | "processing"
    | "forwarded"
    | "completed"
    | "cancelled"
    | "overdue";

export interface StatusMeta {
    /** Nhãn mặc định tiếng Việt */
    label: string;
    /** Màu chữ */
    color: string;
    /** Màu nền badge */
    bg: string;
}

export const STATUS_META: Record<WorkflowStatus, StatusMeta> = {
    draft: { label: "Nháp", color: "#767A7F", bg: "#F4F5F6" },
    pending: { label: "Chờ duyệt", color: "#F59E0B", bg: "#FFF7E6" },
    approved: { label: "Đã duyệt", color: "#16A34A", bg: "#EAF8EF" },
    rejected: { label: "Từ chối", color: "#DC2626", bg: "#FEECEC" },
    processing: { label: "Đang xử lý", color: "#0284C7", bg: "#E8F6FC" },
    forwarded: { label: "Chuyển tiếp", color: "#7C3AED", bg: "#F3E8FF" },
    completed: { label: "Hoàn thành", color: "#16A34A", bg: "#EAF8EF" },
    cancelled: { label: "Đã hủy", color: "#767A7F", bg: "#E9EBED" },
    overdue: { label: "Quá hạn", color: "#DC2626", bg: "#FEECEC" },
};

/** Lấy meta an toàn (fallback về draft nếu trạng thái lạ). */
export const getStatusMeta = (status?: string): StatusMeta =>
    (status && STATUS_META[status as WorkflowStatus]) || STATUS_META.draft;

/**
 * Meta nhãn badge dùng chung cho các module khu phố / tương tác / tài chính
 * (định nghĩa một nơi để tránh trùng export khi gộp barrel `@constants`).
 */
export interface BadgeMeta {
    label: string;
    color: string;
    bg: string;
}
