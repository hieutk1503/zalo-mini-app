import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Icon, Text, useNavigate } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import {
    DataList,
    FilterBar,
    MetaBadge,
    StatusTabs,
} from "@components/common";
import { useStore } from "@store";
import { ROUTES } from "@constants/common";
import { MEETING_STATUS_META } from "@constants/neighborhood";
import { Meeting } from "@dts";
import { matchKeyword } from "@utils/string";

const Item = styled.div`
    ${tw`bg-ui_bg rounded-lg p-4 mb-3 border border-border`}
`;

const MetaRow = styled.div`
    ${tw`flex flex-row items-center text-text_2 mt-1`}
    gap: 6px;
`;

const TABS = [
    { label: "Sắp diễn ra", value: "scheduled" },
    { label: "Đã kết thúc", value: "finished" },
    { label: "Tất cả", value: undefined as string | undefined },
];

const fmtDateTime = (s?: string) => {
    if (!s) return "—";
    const [d, t] = s.split("T");
    const date = d ? d.split("-").reverse().join("/") : "";
    return t ? `${t} · ${date}` : date;
};

const MeetingsPage: React.FC = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState<string | undefined>("scheduled");

    const [meetings, getMeetings, loading, error] = useStore(state => [
        state.meetings,
        state.getMeetings,
        state.gettingMeetings,
        state.meetingsError,
    ]);

    const load = () => getMeetings({ limit: 500 });

    useEffect(() => {
        load();
    }, []);

    const all = meetings?.meetings || [];

    const filtered = useMemo(
        () =>
            all
                .filter(m => (status ? m.status === status : true))
                .filter(m =>
                    keyword
                        ? matchKeyword(keyword, [m.title, m.content, m.location])
                        : true,
                ),
        [all, status, keyword],
    );

    return (
        <PageLayout title="Cuộc họp" id="meetings-page">
            <FilterBar
                keyword={keyword}
                onKeywordChange={setKeyword}
                placeholder="Tìm theo tên, nội dung, địa điểm"
            />
            <StatusTabs tabs={TABS} value={status} onChange={setStatus} />

            <Box p={4}>
                <DataList<Meeting>
                    items={filtered}
                    loading={loading}
                    error={error}
                    onRetry={load}
                    keyExtractor={m => m.id}
                    emptyTitle="Chưa có cuộc họp"
                    emptyDescription="Cuộc họp theo trạng thái sẽ hiển thị ở đây"
                    renderItem={m => (
                        <Item
                            onClick={() =>
                                navigate(`${ROUTES.MEETINGS}/${m.id}`, {
                                    animate: true,
                                    direction: "forward",
                                })
                            }
                        >
                            <Box tw="flex flex-row items-start justify-between">
                                <Text tw="text-text_1 font-medium flex-1 pr-2">
                                    {m.title}
                                </Text>
                                <MetaBadge meta={MEETING_STATUS_META[m.status]} />
                            </Box>
                            <MetaRow>
                                <Icon icon="zi-clock-1" size={14} />
                                <Text size="xxSmall" tw="text-text_2">
                                    {fmtDateTime(m.startTime)}
                                </Text>
                            </MetaRow>
                            <MetaRow>
                                <Icon icon="zi-location" size={14} />
                                <Text size="xxSmall" tw="text-text_2">
                                    {m.location}
                                </Text>
                            </MetaRow>
                            <Text size="xxSmall" tw="text-text_3 mt-1">
                                {m.participantCount ?? 0} người tham dự
                            </Text>
                        </Item>
                    )}
                />
            </Box>

            <Box
                tw="fixed left-0 right-0 px-4"
                style={{
                    bottom: "calc(var(--zaui-safe-area-inset-bottom, 0px) + 16px)",
                }}
            >
                <Button
                    fullWidth
                    onClick={() =>
                        navigate(ROUTES.MEETING_CREATE, {
                            animate: true,
                            direction: "forward",
                        })
                    }
                >
                    Tạo cuộc họp
                </Button>
            </Box>
        </PageLayout>
    );
};

export default MeetingsPage;
