import React, { ReactNode } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import { Box, Input } from "zmp-ui";

interface FilterBarProps {
    keyword: string;
    onKeywordChange: (value: string) => void;
    placeholder?: string;
    /** Chip/Select lọc bổ sung hiển thị dưới ô tìm kiếm. */
    children?: ReactNode;
}

const Wrapper = styled(Box)`
    ${tw`bg-ui_bg p-4`}
`;

/**
 * Thanh tìm kiếm + bộ lọc (design system §10.4 thu gọn cho mobile).
 */
const FilterBar: React.FC<FilterBarProps> = ({
    keyword,
    onKeywordChange,
    placeholder = "Tìm kiếm",
    children,
}) => (
    <Wrapper>
        <Input.Search
            placeholder={placeholder}
            value={keyword}
            onChange={e => onKeywordChange(e.target.value)}
            clearable
        />
        {children && (
            <Box mt={3} tw="flex flex-row flex-wrap">
                {children}
            </Box>
        )}
    </Wrapper>
);

export default FilterBar;
