import React, { ReactNode } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import { Box, Button, Text } from "zmp-ui";
import { ClockIcon } from "../icons";

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: ReactNode;
    /** Nút hành động, thường dùng "Thử lại" cho trạng thái lỗi. */
    actionLabel?: string;
    onAction?: () => void;
}

const Wrapper = styled(Box)`
    ${tw`flex flex-col items-center justify-center text-center py-10 px-6`}
`;

/**
 * Trạng thái rỗng / lỗi dùng chung (design system §9.6).
 * - Empty: chỉ title + description.
 * - Error: truyền actionLabel="Thử lại" + onAction.
 */
const EmptyState: React.FC<EmptyStateProps> = ({
    title = "Chưa có dữ liệu",
    description,
    icon,
    actionLabel,
    onAction,
}) => (
    <Wrapper>
        {icon || <ClockIcon />}
        <Text tw="text-text_1 font-medium mt-3">{title}</Text>
        {description && (
            <Text size="small" tw="text-text_2 mt-1">
                {description}
            </Text>
        )}
        {actionLabel && onAction && (
            <Button
                size="small"
                variant="secondary"
                tw="mt-4"
                onClick={onAction}
            >
                {actionLabel}
            </Button>
        )}
    </Wrapper>
);

export default EmptyState;
