import React, { useEffect, useMemo, useState } from "react";
import { Box, Text, useNavigate } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { DataList, FilterBar, MetaBadge, StatusTabs } from "@components/common";
import { useStore } from "@store";
import { ROUTES } from "@constants/common";
import { SURVEY_STATUS_META } from "@constants/engagement";
import { SurveyCampaign } from "@dts";
import { matchKeyword } from "@utils/string";

const Item = styled.div`
    ${tw`bg-ui_bg rounded-lg p-4 mb-3 border border-border`}
`;

const DoneTag = styled.span`
    ${tw`text-[11px] font-medium rounded px-2 py-0.5 bg-success_50 text-success`}
`;

const TABS = [
    { label: "Đang mở", value: "active" },
    { label: "Đã đóng", value: "closed" },
    { label: "Tất cả", value: undefined as string | undefined },
];

const SurveysPage: React.FC = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState<string | undefined>("active");

    const [surveyCampaigns, getSurveyCampaigns, loading, error] = useStore(
        state => [
            state.surveyCampaigns,
            state.getSurveyCampaigns,
            state.gettingSurveyCampaigns,
            state.surveyCampaignsError,
        ],
    );

    const load = () => getSurveyCampaigns({ limit: 500 });

    useEffect(() => {
        load();
    }, []);

    const all = surveyCampaigns?.surveys || [];

    const filtered = useMemo(
        () =>
            all
                .filter(s => (status ? s.status === status : true))
                .filter(s =>
                    keyword
                        ? matchKeyword(keyword, [s.title, s.description])
                        : true,
                ),
        [all, status, keyword],
    );

    return (
        <PageLayout title="Khảo sát" id="surveys-page">
            <FilterBar
                keyword={keyword}
                onKeywordChange={setKeyword}
                placeholder="Tìm khảo sát"
            />
            <StatusTabs tabs={TABS} value={status} onChange={setStatus} />

            <Box p={4}>
                <DataList<SurveyCampaign>
                    items={filtered}
                    loading={loading}
                    error={error}
                    onRetry={load}
                    keyExtractor={s => s.id}
                    emptyTitle="Chưa có khảo sát"
                    emptyDescription="Khảo sát đang mở sẽ hiển thị ở đây"
                    renderItem={s => (
                        <Item
                            onClick={() =>
                                navigate(`${ROUTES.SURVEYS}/${s.id}`, {
                                    animate: true,
                                    direction: "forward",
                                })
                            }
                        >
                            <Box tw="flex flex-row items-start justify-between">
                                <Text tw="text-text_1 font-medium flex-1 pr-2">
                                    {s.title}
                                </Text>
                                <MetaBadge
                                    meta={SURVEY_STATUS_META[s.status]}
                                />
                            </Box>
                            {s.description && (
                                <Text size="small" tw="text-text_2 mt-1">
                                    {s.description}
                                </Text>
                            )}
                            <Box tw="flex flex-row items-center justify-between mt-2">
                                <Text size="xxSmall" tw="text-text_3">
                                    {s.questions?.length || 0} câu ·{" "}
                                    {s.participantCount ?? 0} lượt
                                </Text>
                                {s.participated && (
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

export default SurveysPage;
