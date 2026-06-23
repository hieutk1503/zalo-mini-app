/**
 * Nhãn, meta và tiện ích định dạng tiền cho module Quản lý thu/chi.
 */
import { ExpenseStatus, IncomeCampaignStatus, PaymentStatus } from "@dts";
import { BadgeMeta } from "./status";

export const INCOME_STATUS_META: Record<IncomeCampaignStatus, BadgeMeta> = {
    draft: { label: "Nháp", color: "#767A7F", bg: "#F4F5F6" },
    active: { label: "Đang thu", color: "#16A34A", bg: "#EAF8EF" },
    closed: { label: "Đã đóng", color: "#767A7F", bg: "#E9EBED" },
};

export const PAYMENT_STATUS_META: Record<PaymentStatus, BadgeMeta> = {
    unpaid: { label: "Chưa đóng", color: "#F59E0B", bg: "#FFF7E6" },
    paid: { label: "Đã đóng", color: "#16A34A", bg: "#EAF8EF" },
    partial: { label: "Đóng một phần", color: "#0284C7", bg: "#E8F6FC" },
    exempt: { label: "Miễn giảm", color: "#767A7F", bg: "#E9EBED" },
};

export const EXPENSE_STATUS_META: Record<ExpenseStatus, BadgeMeta> = {
    recorded: { label: "Đã ghi nhận", color: "#0284C7", bg: "#E8F6FC" },
    approved: { label: "Đã duyệt", color: "#16A34A", bg: "#EAF8EF" },
    rejected: { label: "Từ chối", color: "#DC2626", bg: "#FEECEC" },
};

/** Loại khoản thu (mẫu) */
export const FEE_TYPES: string[] = [
    "Quỹ vệ sinh môi trường",
    "Quỹ an ninh quốc phòng",
    "Quỹ khuyến học",
    "Quỹ hoạt động khu phố",
    "Đóng góp tự nguyện",
    "Khác",
];

/** Nguồn quỹ chi (mẫu) */
export const FUND_SOURCES: string[] = [
    "Quỹ hoạt động khu phố",
    "Quỹ vệ sinh môi trường",
    "Quỹ khuyến học",
    "Ngân sách hỗ trợ",
    "Khác",
];

export const PAYMENT_STATUS_OPTIONS: { value: PaymentStatus; label: string }[] =
    [
        { value: "unpaid", label: "Chưa đóng" },
        { value: "paid", label: "Đã đóng" },
        { value: "partial", label: "Đóng một phần" },
        { value: "exempt", label: "Miễn giảm" },
    ];

/** Định dạng tiền VND, vd 1000000 -> "1.000.000 ₫" */
export const formatVnd = (value?: number): string => {
    if (value === undefined || value === null || Number.isNaN(value)) {
        return "—";
    }
    return `${value.toLocaleString("vi-VN")} ₫`;
};
