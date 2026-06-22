import React, { ReactNode } from "react";
import styled, { keyframes } from "styled-components";
import tw from "twin.macro";
import EmptyState from "./EmptyState";

interface DataListProps<T> {
    items?: T[];
    loading?: boolean;
    error?: boolean;
    renderItem: (item: T, index: number) => ReactNode;
    keyExtractor: (item: T, index: number) => string | number;
    emptyTitle?: string;
    emptyDescription?: string;
    errorTitle?: string;
    onRetry?: () => void;
    skeletonCount?: number;
}

const pulse = keyframes`
    0% { opacity: 1; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
`;

const Skeleton = styled.div`
    ${tw`bg-ng_10 rounded-lg mb-3`}
    height: 84px;
    animation: ${pulse} 1.2s ease-in-out infinite;
`;

/**
 * Danh sách dữ liệu kèm 3 trạng thái: loading (skeleton), empty, error
 * (design system §9.6 + checklist). Tự xử lý hiển thị theo dữ liệu truyền vào.
 */
function DataList<T>({
    items,
    loading,
    error,
    renderItem,
    keyExtractor,
    emptyTitle = "Chưa có dữ liệu",
    emptyDescription,
    errorTitle = "Không tải được dữ liệu, vui lòng thử lại",
    onRetry,
    skeletonCount = 4,
}: DataListProps<T>) {
    const list = items || [];

    if (loading && list.length === 0) {
        return (
            <>
                {Array.from({ length: skeletonCount }).map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Skeleton key={i} />
                ))}
            </>
        );
    }

    if (error && list.length === 0) {
        return (
            <EmptyState
                title={errorTitle}
                actionLabel={onRetry ? "Thử lại" : undefined}
                onAction={onRetry}
            />
        );
    }

    if (!loading && list.length === 0) {
        return <EmptyState title={emptyTitle} description={emptyDescription} />;
    }

    return (
        <>
            {list.map((item, index) => (
                <React.Fragment key={keyExtractor(item, index)}>
                    {renderItem(item, index)}
                </React.Fragment>
            ))}
        </>
    );
}

export default DataList;
