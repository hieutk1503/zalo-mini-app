import React from "react";

/** Icon Nhóm cộng đồng (nhóm người). */
const GroupIcon: React.FC<any> = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="44"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle cx="8" cy="9" r="3" fill="#046DD6" />
        <circle cx="16" cy="9" r="3" fill="#8ABEFF" />
        <path
            fill="#046DD6"
            d="M2 18c0-2.5 2.7-4 6-4s6 1.5 6 4v2H2v-2z"
        />
        <path
            fill="#8ABEFF"
            d="M14.5 14.2c2.6.2 5.5 1.6 5.5 3.8v2h-5v-2c0-1.5-.7-2.8-1.7-3.7.4-.1.8-.1 1.2-.1z"
        />
    </svg>
);

export default GroupIcon;
