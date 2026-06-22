import React, { ReactNode } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import { Text } from "zmp-ui";

interface SectionCardProps {
    title?: string;
    /** Link/nút bên phải tiêu đề (vd "Xem tất cả"). */
    actionLabel?: string;
    onAction?: () => void;
    children?: ReactNode;
    /** Bỏ padding nội dung khi cần list sát mép. */
    noPadding?: boolean;
    className?: string;
}

const Card = styled.div`
    ${tw`bg-ui_bg rounded-lg`}
`;

const Header = styled.div`
    ${tw`flex flex-row items-center justify-between px-4 pt-4`}
`;

const Body = styled.div<{ $noPadding?: boolean }>`
    ${({ $noPadding }) => ($noPadding ? tw`p-0` : tw`p-4`)}
`;

/**
 * Card section nền trắng, bo góc 8px (design system §9.3).
 * Không lồng quá 2 cấp card.
 */
const SectionCard: React.FC<SectionCardProps> = ({
    title,
    actionLabel,
    onAction,
    children,
    noPadding,
    className,
}) => (
    <Card className={className}>
        {(title || actionLabel) && (
            <Header>
                {title && (
                    <Text.Title size="small" tw="text-text_1 font-semibold">
                        {title}
                    </Text.Title>
                )}
                {actionLabel && (
                    <button type="button" onClick={onAction} tw="text-main text-sm">
                        {actionLabel}
                    </button>
                )}
            </Header>
        )}
        <Body $noPadding={noPadding}>{children}</Body>
    </Card>
);

export default SectionCard;
