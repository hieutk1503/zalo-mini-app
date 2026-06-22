import React from "react";

/** Icon Quản lý thu (ví tiền). */
const IncomeIcon: React.FC<any> = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="44"
        fill="none"
        viewBox="0 0 24 24"
    >
        <rect x="3" y="6" width="18" height="13" rx="2" fill="#16A34A" />
        <path fill="#8ABEFF" d="M3 9h18v3H3z" opacity="0.4" />
        <circle cx="17" cy="13" r="2" fill="#fff" />
        <path
            stroke="#16A34A"
            strokeWidth="1.6"
            strokeLinecap="round"
            d="M12 3l5 3H7l5-3z"
        />
    </svg>
);

export default IncomeIcon;
