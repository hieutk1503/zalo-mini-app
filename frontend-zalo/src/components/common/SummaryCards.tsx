import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import { Text } from "zmp-ui";

export interface SummaryItem {
    label: string;
    value: number | string;
    /** Màu chữ giá trị (hex). Mặc định màu chính. */
    color?: string;
}

interface SummaryCardsProps {
    items: SummaryItem[];
}

const Grid = styled.div<{ $cols: number }>`
    ${tw`grid gap-2`}
    grid-template-columns: repeat(${({ $cols }) => $cols}, minmax(0, 1fr));
`;

const Item = styled.div`
    ${tw`bg-ui_bg rounded-lg py-3 px-2 text-center border border-border`}
`;

/**
 * Hàng thẻ số liệu tổng quan (design system §11.2): Tổng / Đã duyệt /
 * Chờ duyệt / Từ chối. Dùng đầu màn hình Cư dân / Hộ dân.
 */
const SummaryCards: React.FC<SummaryCardsProps> = ({ items }) => (
    <Grid $cols={Math.min(items.length, 4) || 1}>
        {items.map(item => (
            <Item key={item.label}>
                <Text
                    tw="font-semibold"
                    style={{ color: item.color || "#C8102E", fontSize: 20 }}
                >
                    {item.value}
                </Text>
                <Text size="xxSmall" tw="text-text_2 mt-0.5">
                    {item.label}
                </Text>
            </Item>
        ))}
    </Grid>
);

export default SummaryCards;
