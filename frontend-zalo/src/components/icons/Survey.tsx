import React from "react";

/** Icon Khảo sát (bảng câu hỏi / checklist). */
const SurveyIcon: React.FC<any> = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="44"
        fill="none"
        viewBox="0 0 24 24"
    >
        <rect x="5" y="3" width="14" height="18" rx="2" fill="#8ABEFF" />
        <rect x="8" y="2" width="8" height="3" rx="1" fill="#046DD6" />
        <path
            stroke="#046DD6"
            strokeWidth="1.6"
            strokeLinecap="round"
            d="M8.5 10h7M8.5 13.5h7M8.5 17h4"
        />
    </svg>
);

export default SurveyIcon;
