import React from "react";

/** Icon Duyệt thông tin (dấu tích trong vòng tròn). */
const ApprovalIcon: React.FC<any> = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="44"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle cx="12" cy="12" r="10" fill="#16A34A" />
        <path
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 12.5l3 3 6-6.5"
        />
    </svg>
);

export default ApprovalIcon;
