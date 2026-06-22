import React from "react";

/** Icon Quản lý chi (hóa đơn / biên lai). */
const ExpenseIcon: React.FC<any> = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="44"
        fill="none"
        viewBox="0 0 24 24"
    >
        <path
            fill="#F59E0B"
            d="M6 2h12v20l-2-1.5L14 22l-2-1.5L10 22l-2-1.5L6 22V2z"
        />
        <path
            stroke="#fff"
            strokeWidth="1.6"
            strokeLinecap="round"
            d="M9 7h6M9 11h6M9 15h4"
        />
    </svg>
);

export default ExpenseIcon;
