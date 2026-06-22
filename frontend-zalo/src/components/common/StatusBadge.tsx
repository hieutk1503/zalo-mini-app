import React from "react";
import { getStatusMeta, WorkflowStatus } from "@constants/status";

interface StatusBadgeProps {
    status?: WorkflowStatus | string;
    /** Ghi đè nhãn (vd phản ánh dùng "Chờ xử lý" thay vì "Chờ duyệt"). */
    label?: string;
}

/**
 * Badge trạng thái nghiệp vụ thống nhất theo design system:
 * bo góc 999px, padding 4x8, font 12px/500.
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
    const meta = getStatusMeta(status);
    return (
        <span
            style={{
                color: meta.color,
                backgroundColor: meta.bg,
                borderRadius: 999,
                padding: "4px 8px",
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "16px",
                display: "inline-block",
                whiteSpace: "nowrap",
            }}
        >
            {label || meta.label}
        </span>
    );
};

export default StatusBadge;
