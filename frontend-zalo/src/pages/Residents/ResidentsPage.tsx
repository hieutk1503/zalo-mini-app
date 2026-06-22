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
import { Resident } from "@dts";
import { matchKeyword, maskCitizenId, maskPhoneNumber } from "@utils/string";

const Item = styled.div`
    ${tw`bg-ui_bg rounded-lg p-4 mb-3 border border-border`}
`;

const TABS = [
    { label: "Tất cả", value: undefined as string | undefined },
    { label: "Chờ duyệt", value: "pending" },
    { label: "Đã duyệt", value: "approved" },
    { label: "Từ chối", value: "rejected" },
];

const ResidentsPage: React.FC = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState<string | undefined>(undefined);

    const [residents, getResidents, loading, error] = useStore(state => [
        state.residents,
        state.getResidents,
        state.gettingResidents,
        state.residentsError,
    ]);

    const load = () => getResidents({ limit: 500 });

    useEffect(() => {
        load();
    }, []);

    const all = residents?.residents || [];

    const counts = useMemo(
        () => ({
            total: all.length,
            approved: all.filter(r => r.status === "approved").length,
            pending: all.filter(r => r.status === "pending").length,
            rejected: all.filter(r => r.status === "rejected").length,
        }),
        [all],
    );

    const filtered = useMemo(
        () =>
            all
                .filter(r => (status ? r.status === status : true))
                .filter(r =>
                    keyword
                        ? matchKeyword(keyword, [
                              r.fullName,
                              r.citizenId,
                              r.phone,
                          ])
                        : true,
                ),
        [all, status, keyword],
    );

    const goDetail = (id: string) =>
        navigate(`${ROUTES.RESIDENTS}/${id}`, {
            animate: true,
            direction: "forward",
        });

    return (
        <PageLayout title="Cư dân" id="residents-page">
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
                placeholder="Tìm theo họ tên, CCCD, SĐT"
            />

            <StatusTabs tabs={TABS} value={status} onChange={setStatus} />

            <Box p={4}>
                <DataList<Resident>
                    items={filtered}
                    loading={loading}
                    error={error}
                    onRetry={load}
                    keyExtractor={r => r.id}
                    emptyTitle="Chưa có cư dân phù hợp"
                    emptyDescription="Thử đổi bộ lọc hoặc thêm cư dân mới"
                    renderItem={r => (
                        <Item onClick={() => goDetail(r.id)}>
                            <Box tw="flex flex-row items-start justify-between">
                                <Text tw="text-text_1 font-medium flex-1 pr-2">
                                    {r.fullName}
                                </Text>
                                <StatusBadge status={r.status} />
                            </Box>
                            <Text size="small" tw="text-text_2 mt-1">
                                {r.relationToHead || "—"}
                                {r.neighborhoodGroup
                                    ? ` · ${r.neighborhoodGroup}`
                                    : ""}
                            </Text>
                            <Text size="small" tw="text-text_2 mt-0.5">
                                CCCD: {maskCitizenId(r.citizenId)} · SĐT:{" "}
                                {maskPhoneNumber(r.phone)}
                            </Text>
                            {r.status === "rejected" && r.rejectReason && (
                                <Text size="xxSmall" tw="text-danger mt-1">
                                    Lý do từ chối: {r.rejectReason}
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
                        navigate(ROUTES.RESIDENT_CREATE, {
                            animate: true,
                            direction: "forward",
                        })
                    }
                >
                    Thêm cư dân
                </Button>
            </Box>
        </PageLayout>
    );
};

export default ResidentsPage;
