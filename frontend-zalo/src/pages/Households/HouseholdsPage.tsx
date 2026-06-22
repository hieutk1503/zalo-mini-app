import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Text, useNavigate } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import {
    DataList,
    FilterBar,
    StatusBadge,
    StatusTabs,
    SummaryCards,
} from "@components/common";
import { useStore } from "@store";
import { ROUTES } from "@constants/common";
import { householdTypeLabel } from "@constants/resident-group";
import { Household } from "@dts";
import { matchKeyword } from "@utils/string";

const Item = styled.div`
    ${tw`bg-ui_bg rounded-lg p-4 mb-3 border border-border`}
`;

const TABS = [
    { label: "Tất cả", value: undefined as string | undefined },
    { label: "Chờ duyệt", value: "pending" },
    { label: "Đã duyệt", value: "approved" },
    { label: "Từ chối", value: "rejected" },
];

const HouseholdsPage: React.FC = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState<string | undefined>(undefined);

    const [households, getHouseholds, loading, error] = useStore(state => [
        state.households,
        state.getHouseholds,
        state.gettingHouseholds,
        state.householdsError,
    ]);

    const load = () => getHouseholds({ limit: 500 });

    useEffect(() => {
        load();
    }, []);

    const all = households?.households || [];

    const counts = useMemo(
        () => ({
            total: all.length,
            approved: all.filter(h => h.status === "approved").length,
            pending: all.filter(h => h.status === "pending").length,
            rejected: all.filter(h => h.status === "rejected").length,
        }),
        [all],
    );

    const filtered = useMemo(
        () =>
            all
                .filter(h => (status ? h.status === status : true))
                .filter(h =>
                    keyword
                        ? matchKeyword(keyword, [
                              h.code,
                              h.headName,
                              h.addressDetail,
                          ])
                        : true,
                ),
        [all, status, keyword],
    );

    const goDetail = (id: string) =>
        navigate(`${ROUTES.HOUSEHOLDS}/${id}`, {
            animate: true,
            direction: "forward",
        });

    return (
        <PageLayout title="Hộ dân" id="households-page">
            <Box p={4} tw="bg-ui_bg">
                <SummaryCards
                    items={[
                        { label: "Tổng", value: counts.total },
                        {
                            label: "Đã duyệt",
                            value: counts.approved,
                            color: "#16A34A",
                        },
                        {
                            label: "Chờ duyệt",
                            value: counts.pending,
                            color: "#F59E0B",
                        },
                        {
                            label: "Từ chối",
                            value: counts.rejected,
                            color: "#DC2626",
                        },
                    ]}
                />
            </Box>

            <FilterBar
                keyword={keyword}
                onKeywordChange={setKeyword}
                placeholder="Tìm theo mã hộ, chủ hộ, địa chỉ"
            />

            <StatusTabs tabs={TABS} value={status} onChange={setStatus} />

            <Box p={4}>
                <DataList<Household>
                    items={filtered}
                    loading={loading}
                    error={error}
                    onRetry={load}
                    keyExtractor={h => h.id}
                    emptyTitle="Chưa có hộ dân phù hợp"
                    emptyDescription="Thử đổi bộ lọc hoặc thêm hộ mới"
                    renderItem={h => (
                        <Item onClick={() => goDetail(h.id)}>
                            <Box tw="flex flex-row items-start justify-between">
                                <Text size="small" tw="text-main font-medium">
                                    {h.code}
                                </Text>
                                <StatusBadge status={h.status} />
                            </Box>
                            <Text tw="text-text_1 font-medium mt-0.5">
                                {h.headName}
                            </Text>
                            <Text size="small" tw="text-text_2 mt-1">
                                {h.addressDetail}
                            </Text>
                            <Text size="small" tw="text-text_2 mt-0.5">
                                {h.neighborhoodGroup} ·{" "}
                                {householdTypeLabel(h.householdType)} ·{" "}
                                {h.memberCount ?? h.members?.length ?? 0} nhân
                                khẩu
                            </Text>
                            {h.status === "rejected" && h.rejectReason && (
                                <Text size="xxSmall" tw="text-danger mt-1">
                                    Lý do từ chối: {h.rejectReason}
                                </Text>
                            )}
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
                        navigate(ROUTES.HOUSEHOLD_CREATE, {
                            animate: true,
                            direction: "forward",
                        })
                    }
                >
                    Thêm hộ dân
                </Button>
            </Box>
        </PageLayout>
    );
};

export default HouseholdsPage;
