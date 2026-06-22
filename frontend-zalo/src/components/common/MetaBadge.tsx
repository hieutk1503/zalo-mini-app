import React from "react";

interface MetaBadgeProps {
    meta: { label: string; color: string; bg: string };
    /** Cỡ nhỏ cho list item */
    small?: boolean;
}

/**
 * Badge tổng quát theo meta {label,color,bg} (hex). Dùng cho các trạng thái
 * không nằm trong WorkflowStatus: mức độ thông báo, trạng thái cuộc họp,
 * xác nhận tham gia, trạng thái nhóm...
 */
const MetaBadge: React.FC<MetaBadgeProps> = ({ meta, small }) => (
    <span
        style={{
            color: meta.color,
            backgroundColor: meta.bg,
            borderRadius: 999,
            padding: small ? "2px 8px" : "4px 8px",
            fontSize: small ? 11 : 12,
            fontWeight: 500,
            lineHeight: "16px",
            display: "inline-block",
            whiteSpace: "nowrap",
        }}
    >
        {meta.label}
    </span>
);

export default MetaBadge;
