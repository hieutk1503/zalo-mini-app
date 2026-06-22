import React, { useEffect, useMemo, useState } from "react";
import { Box, Text, useNavigate } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { DataList, FilterBar, StatusTabs } from "@components/common";
import { useStore } from "@store";
import { ROUTES } from "@constants/common";
import { NOTIFICATION_LEVEL_META } from "@constants/reflection";
import { NotificationLevel, QuickNotification } from "@dts";
import { matchKeyword } from "@utils/string";

const Item = styled.div<{ $unread: boolean }>`
    ${tw`bg-ui_bg rounded-lg p-4 mb-3 border`}
    ${({ $unread }) => ($unread ? tw`border-primary_50` : tw`border-border`)}
`;

const Dot = styled.span`
    ${tw`inline-block bg-danger`}
    width: 8px;
    height: 8px;
    border-radius: 999px;
    margin-left: 8px;
    flex-shrink: 0;
`;

const LevelBadge: React.FC<{ level: NotificationLevel }> = ({ level }) => {
    const meta = NOTIFICATION_LEVEL_META[level];
    return (
        <span
            style={{
                color: meta.color,
                backgroundColor: meta.bg,
                borderRadius: 999,
                padding: "2px 8px",
                fontSize: 11,
                fontWeight: 500,
                whiteSpace: "nowrap",
            }}
        >
            {meta.label}
        </span>
    );
};

const TABS = [
    { label: "Tất cả", value: undefined as string | undefined },
    { label: "Khẩn", value: "urgent" },
    { label: "Quan trọng", value: "important" },
    { label: "Thường", value: "normal" },
];

const viDate = (value?: string) =>
    value ? value.split("-").reverse().join("/") : "—";

const NotificationsPage: React.FC = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [level, setLevel] = useState<string | undefined>(undefined);

    const [notifications, getNotifications, loading, error] = useStore(
        state => [
            state.notifications,
            state.getNotifications,
            state.gettingNotifications,
            state.notificationsError,
        ],
    );

    const load = () => getNotifications({ limit: 500 });

    useEffect(() => {
        load();
    }, []);

    const all = notifications?.notifications || [];

    const filtered = useMemo(
        () =>
            all
                .filter(n => (level ? n.level === level : true))
                .filter(n =>
                    keyword
                        ? matchKeyword(keyword, [n.title, n.content])
                        : true,
                ),
        [all, level, keyword],
    );

    return (
        <PageLayout title="Thông báo" id="notifications-page">
            <FilterBar
                keyword={keyword}
                onKeywordChange={setKeyword}
                placeholder="Tìm thông báo"
            />
            <StatusTabs tabs={TABS} value={level} onChange={setLevel} />

            <Box p={4}>
                <DataList<QuickNotification>
                    items={filtered}
                    loading={loading}
                    error={error}
                    onRetry={load}
                    keyExtractor={n => n.id}
                    emptyTitle="Chưa có thông báo"
                    renderItem={n => (
                        <Item
                            $unread={!n.read}
                            onClick={() =>
                                navigate(`${ROUTES.NOTIFICATIONS}/${n.id}`, {
                                    animate: true,
                                    direction: "forward",
                                })
                            }
                        >
                            <Box tw="flex flex-row items-start justify-between">
                                <Box tw="flex-1 pr-2 flex flex-row items-center">
                                    <LevelBadge level={n.level} />
                                    {!n.read && <Dot />}
                                </Box>
                                <Text size="xxSmall" tw="text-text_2">
                                    {viDate(n.sentAt)}
                                </Text>
                            </Box>
                            <Text
                                tw="text-text_1 mt-2"
                                style={{ fontWeight: n.read ? 500 : 700 }}
                            >
                                {n.title}
                            </Text>
                            <Text size="small" tw="text-text_2 mt-1">
                                {n.content.length > 90
                                    ? `${n.content.slice(0, 90)}…`
                                    : n.content}
                            </Text>
                            {n.neighborhoodGroup && (
                                <Text size="xxSmall" tw="text-text_3 mt-1">
                                    {n.neighborhoodGroup}
                                </Text>
                            )}
                        </Item>
                    )}
                />
            </Box>
        </PageLayout>
    );
};

export default NotificationsPage;
