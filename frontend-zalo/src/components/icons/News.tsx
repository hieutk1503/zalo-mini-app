import React from "react";

/** Icon Tin tức (báo). */
const NewsIcon: React.FC<any> = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="44"
        fill="none"
        viewBox="0 0 24 24"
    >
        <rect x="3" y="5" width="14" height="15" rx="2" fill="#8ABEFF" />
        <rect x="6" y="3" width="15" height="17" rx="2" fill="#046DD6" />
        <path
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
            d="M9 7.5h9M9 11h9M9 14.5h6"
        />
    </svg>
);

export default NewsIcon;
