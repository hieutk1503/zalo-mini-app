import React from "react";

/** Icon Cuộc họp (lịch). */
const MeetingIcon: React.FC<any> = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="44"
        fill="none"
        viewBox="0 0 24 24"
    >
        <rect x="3" y="5" width="18" height="16" rx="2" fill="#8ABEFF" />
        <rect x="3" y="5" width="18" height="4" rx="2" fill="#046DD6" />
        <path fill="#046DD6" d="M7 3h2v4H7zM15 3h2v4h-2z" />
        <path
            fill="#fff"
            d="M7 12h4v3H7zm0 0"
        />
    </svg>
);

export default MeetingIcon;
