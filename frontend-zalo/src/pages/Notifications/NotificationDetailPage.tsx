import React, { useEffect } from "react";
import { Box, Text, useNavigate, useParams } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { EmptyState, SectionCard } from "@components/common";
import { useStore } from "@store";
import { NOTIFICATION_LEVEL_META } from "@constants/reflection";
import { NotificationLevel } from "@dts";

const LoadingBlock = styled.div`
    ${tw`bg-ng_10 rounded-lg`}
    height: 180px;
`;

const LevelBadge: React.FC<{ level: NotificationLevel }> = ({ level }) => {
    const meta = NOTIFICATION_LEVEL_META[level];
    return (
        <span
            style={{
                color: meta.color,
                backgroundColor: meta.bg,
                borderRadius: 999,
                padding: "4px 10px",
                fontSize: 12,
                fontWeight: 500,
            }}
        >
            {meta.label}
        </span>
    );
};

const viDate = (value?: string) =>
    value ? value.split("-").reverse().join("/") : "—";

const NotificationDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [notification, loading, getNotificationDetail] = useStore(state => [
        state.notificationDetail,
        state.gettingNotificationDetail,
        state.getNotificationDetail,
    ]);

    useEffect(() => {
        if (id) {
            getNotificationDetail(id);
        }
    }, [id]);

    if (loading) {
        return (
            <PageLayout title="Chi tiết thông báo" id="notification-loading">
                <Box p={4}>
                    <LoadingBlock />
                </Box>
            </PageLayout>
        );
    }

    if (!notification) {
        return (
            <PageLayout title="Chi tiết thông báo" id="notification-empty">
                <EmptyState
                    title="Không tìm thấy thông báo"
                    actionLabel="Quay lại"
                    onAction={() => navigate(-1)}
                />
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Chi tiết thông báo" id="notification-detail-page">
            <Box p={4}>
                <SectionCard>
                    <Box tw="flex flex-row items-center justify-between">
                        <LevelBadge level={notification.level} />
                        <Text size="xxSmall" tw="text-text_2">
                            {viDate(notification.sentAt)}
                        </Text>
                    </Box>
                    <Text.Title size="small" tw="text-text_1 mt-3">
                        {notification.title}
                    </Text.Title>
                    {notification.neighborhoodGroup && (
                        <Text size="xxSmall" tw="text-text_3 mt-1">
                            Đối tượng: {notification.neighborhoodGroup}
                        </Text>
                    )}
                    <Text
                        tw="text-text_1 mt-3"
                        style={{ whiteSpace: "pre-line" }}
                    >
                        {notification.content}
                    </Text>
                </SectionCard>
            </Box>
        </PageLayout>
    );
};

export default NotificationDetailPage;
