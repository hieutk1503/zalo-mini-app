import React, { useEffect, useMemo, useState } from "react";
import { Box, Text, useNavigate } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { DataList, FilterBar, MetaBadge, StatusTabs } from "@components/common";
import { useStore } from "@store";
import { ROUTES } from "@constants/common";
import { CONTEST_STATUS_META } from "@constants/engagement";
import { Contest } from "@dts";
import { matchKeyword } from "@utils/string";

const Item = styled.div`
    ${tw`bg-ui_bg rounded-lg p-4 mb-3 border border-border`}
`;

const DoneTag = styled.span`
    ${tw`text-[11px] font-medium rounded px-2 py-0.5 bg-success_50 text-success`}
`;

const TABS = [
    { label: "Đang mở", value: "active" },
    { label: "Sắp diễn ra", value: "upcoming" },
    { label: "Đã đóng", value: "closed" },
    { label: "Tất cả", value: undefined as string | undefined },
];

const ContestsPage: React.FC = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState<string | undefined>("active");

    const [contests, getContests, loading, error] = useStore(state => [
        state.contests,
        state.getContests,
        state.gettingContests,
        state.contestsError,
    ]);

    const load = () => getContests({ limit: 500 });

    useEffect(() => {
        load();
    }, []);

    const all = contests?.contests || [];

    const filtered = useMemo(
        () =>
            all
                .filter(c => (status ? c.status === status : true))
                .filter(c =>
                    keyword
                        ? matchKeyword(keyword, [c.title, c.description])
                        : true,
                ),
        [all, status, keyword],
    );

    return (
        <PageLayout title="Cuộc thi" id="contests-page">
            <FilterBar
                keyword={keyword}
                onKeywordChange={setKeyword}
                placeholder="Tìm cuộc thi"
            />
            <StatusTabs tabs={TABS} value={status} onChange={setStatus} />

            <Box p={4}>
                <DataList<Contest>
                    items={filtered}
                    loading={loading}
                    error={error}
                    onRetry={load}
                    keyExtractor={c => c.id}
                    emptyTitle="Chưa có cuộc thi"
                    emptyDescription="Cuộc thi đang mở sẽ hiển thị ở đây"
                    renderItem={c => (
                        <Item
                            onClick={() =>
                                navigate(`${ROUTES.CONTESTS}/${c.id}`, {
                                    animate: true,
                                    direction: "forward",
                                })
                            }
                        >
                            <Box tw="flex flex-row items-start justify-between">
                                <Text tw="text-text_1 font-medium flex-1 pr-2">
                                    {c.title}
                                </Text>
                                <MetaBadge
                                    meta={CONTEST_STATUS_META[c.status]}
                                />
                            </Box>
                            {c.description && (
                                <Text size="small" tw="text-text_2 mt-1">
                                    {c.description}
                                </Text>
                            )}
                            <Box tw="flex flex-row items-center justify-between mt-2">
                                <Text size="xxSmall" tw="text-text_3">
                                    {c.questions?.length || 0} câu
                                    {c.durationMinutes
                                        ? ` · ${c.durationMinutes} phút`
                                        : ""}{" "}
                                    · {c.participantCount ?? 0} lượt
                                </Text>
                                {c.participated && (
                                    <DoneTag>Đã tham gia</DoneTag>
                                )}
                            </Box>
                        </Item>
                    )}
                />
            </Box>
        </PageLayout>
    );
};

export default ContestsPage;
