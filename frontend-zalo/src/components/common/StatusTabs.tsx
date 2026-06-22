import React from "react";
import styled from "styled-components";
import tw from "twin.macro";

export interface StatusTabItem {
    label: string;
    /** undefined = "Tất cả" */
    value?: string;
    /** Số lượng hiển thị kèm nhãn (tuỳ chọn). */
    count?: number;
}

interface StatusTabsProps {
    tabs: StatusTabItem[];
    value?: string;
    onChange: (value?: string) => void;
}

const Bar = styled.div`
    ${tw`flex flex-row flex-nowrap overflow-x-auto bg-ui_bg`}
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
        display: none;
    }
`;

const Tab = styled.button<{ $active: boolean }>`
    ${tw`px-4 py-3 text-sm whitespace-nowrap border-b-2`}
    ${({ $active }) =>
        $active
            ? tw`text-main border-main font-medium`
            : tw`text-text_2 border-transparent`}
`;

/**
 * Hàng tab lọc trạng thái (cuộn ngang trên mobile).
 * Dùng cho Cư dân/Hộ dân/Duyệt/Phản ánh.
 */
const StatusTabs: React.FC<StatusTabsProps> = ({ tabs, value, onChange }) => (
    <Bar>
        {tabs.map(tab => (
            <Tab
                key={tab.label}
                type="button"
                $active={value === tab.value}
                onClick={() => onChange(tab.value)}
            >
                {tab.label}
                {typeof tab.count === "number" ? ` (${tab.count})` : ""}
            </Tab>
        ))}
    </Bar>
);

export default StatusTabs;
