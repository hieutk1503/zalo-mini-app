import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Text, useNavigate } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { DataList, FilterBar, MetaBadge, StatusTabs } from "@components/common";
import { useStore } from "@store";
import { ROUTES } from "@constants/common";
import { GROUP_STATUS_META } from "@constants/neighborhood";
import { CommunityGroup } from "@dts";
import { matchKeyword } from "@utils/string";

const Item = styled.div`
    ${tw`bg-ui_bg rounded-lg p-4 mb-3 border border-border`}
`;

const TopicChip = styled.span`
    ${tw`text-[11px] font-medium rounded px-2 py-0.5 bg-primary_50 text-main`}
`;

const TABS = [
    { label: "Tất cả", value: undefined as string | undefined },
    { label: "Đang hoạt động", value: "active" },
    { label: "Ngừng", value: "inactive" },
];

const CommunityGroupsPage: React.FC = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState<string | undefined>(undefined);

    const [groups, getCommunityGroups, loading, error] = useStore(state => [
        state.groups,
        state.getCommunityGroups,
        state.gettingGroups,
        state.groupsError,
    ]);

    const load = () => getCommunityGroups({ limit: 500 });

    useEffect(() => {
        load();
    }, []);

    const all = groups?.groups || [];

    const filtered = useMemo(
        () =>
            all
                .filter(g => (status ? g.status === status : true))
                .filter(g =>
                    keyword
                        ? matchKeyword(keyword, [
                              g.name,
                              g.description,
                              g.topic,
                          ])
                        : true,
                ),
        [all, status, keyword],
    );

    return (
        <PageLayout title="Nhóm cộng đồng" id="groups-page">
            <FilterBar
                keyword={keyword}
                onKeywordChange={setKeyword}
                placeholder="Tìm theo tên nhóm, chủ đề"
            />
            <StatusTabs tabs={TABS} value={status} onChange={setStatus} />

            <Box p={4}>
                <DataList<CommunityGroup>
                    items={filtered}
                    loading={loading}
                    error={error}
                    onRetry={load}
                    keyExtractor={g => g.id}
                    emptyTitle="Chưa có nhóm cộng đồng"
                    emptyDescription="Tạo nhóm để kết nối và phối hợp hoạt động"
                    renderItem={g => (
                        <Item
                            onClick={() =>
                                navigate(`${ROUTES.COMMUNITY_GROUPS}/${g.id}`, {
                                    animate: true,
                                    direction: "forward",
                                })
                            }
                        >
                            <Box tw="flex flex-row items-start justify-between">
                                <Text tw="text-text_1 font-medium flex-1 pr-2">
                                    {g.name}
                                </Text>
                                <MetaBadge meta={GROUP_STATUS_META[g.status]} />
                            </Box>
                            {g.topic && (
                                <Box mt={1}>
                                    <TopicChip>{g.topic}</TopicChip>
                                </Box>
                            )}
                            {g.description && (
                                <Text size="small" tw="text-text_2 mt-2">
                                    {g.description}
                                </Text>
                            )}
                            <Text size="xxSmall" tw="text-text_3 mt-2">
                                {g.memberCount ?? g.members?.length ?? 0} thành
                                viên
                                {g.creatorName ? ` · ${g.creatorName}` : ""}
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
                        navigate(ROUTES.COMMUNITY_GROUP_CREATE, {
                            animate: true,
                            direction: "forward",
                        })
                    }
                >
                    Tạo nhóm
                </Button>
            </Box>
        </PageLayout>
    );
};

export default CommunityGroupsPage;
