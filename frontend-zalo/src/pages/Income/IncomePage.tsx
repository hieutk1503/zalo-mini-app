import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Text, useNavigate } from "zmp-ui";
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
import { INCOME_STATUS_META, formatVnd } from "@constants/finance";
import { IncomeCampaign } from "@dts";
import { matchKeyword } from "@utils/string";

const Item = styled.div`
    ${tw`bg-ui_bg rounded-lg p-4 mb-3 border border-border`}
`;

const Kpi = styled.div`
    ${tw`bg-ui_bg rounded-lg p-4 border border-border`}
`;

const TABS = [
    { label: "Đang thu", value: "active" },
    { label: "Đã đóng", value: "closed" },
    { label: "Tất cả", value: undefined as string | undefined },
];

const IncomePage: React.FC = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState<string | undefined>(undefined);

    const [incomeCampaigns, getIncomeCampaigns, loading, error] = useStore(
        state => [
            state.incomeCampaigns,
            state.getIncomeCampaigns,
            state.gettingIncomeCampaigns,
            state.incomeCampaignsError,
        ],
    );

    const load = () => getIncomeCampaigns({ limit: 500 });

    useEffect(() => {
        load();
    }, []);

    const all = incomeCampaigns?.campaigns || [];

    const totalCollected = useMemo(
        () => all.reduce((s, c) => s + (c.collectedAmount || 0), 0),
        [all],
    );

    const filtered = useMemo(
        () =>
            all
                .filter(c => (status ? c.status === status : true))
                .filter(c =>
                    keyword
                        ? matchKeyword(keyword, [c.name, c.feeType])
                        : true,
                ),
        [all, status, keyword],
    );

    return (
        <PageLayout title="Quản lý thu" id="income-page">
            <Box p={4} tw="bg-ui_bg">
                <Kpi>
                    <Text size="xxSmall" tw="text-text_2">
                        Tổng đã thu
                    </Text>
                    <Text
                        tw="text-success font-semibold mt-1"
                        style={{ fontSize: 22 }}
                    >
                        {formatVnd(totalCollected)}
                    </Text>
                    <Text size="xxSmall" tw="text-text_3 mt-1">
                        {all.length} đợt thu
                    </Text>
                </Kpi>
            </Box>

            <FilterBar
                keyword={keyword}
                onKeywordChange={setKeyword}
                placeholder="Tìm theo tên đợt thu, khoản thu"
            />
            <StatusTabs tabs={TABS} value={status} onChange={setStatus} />

            <Box p={4}>
                <DataList<IncomeCampaign>
                    items={filtered}
                    loading={loading}
                    error={error}
                    onRetry={load}
                    keyExtractor={c => c.id}
                    emptyTitle="Chưa có đợt thu"
                    emptyDescription="Tạo đợt thu để theo dõi đóng góp"
                    renderItem={c => (
                        <Item
                            onClick={() =>
                                navigate(`${ROUTES.INCOME}/${c.id}`, {
                                    animate: true,
                                    direction: "forward",
                                })
                            }
                        >
                            <Box tw="flex flex-row items-start justify-between">
                                <Text tw="text-text_1 font-medium flex-1 pr-2">
                                    {c.name}
                                </Text>
                                <MetaBadge meta={INCOME_STATUS_META[c.status]} />
                            </Box>
                            <Text size="small" tw="text-text_2 mt-1">
                                {c.feeType}
                                {c.neighborhoodGroup
                                    ? ` · ${c.neighborhoodGroup}`
                                    : ""}
                            </Text>
                            <Box tw="flex flex-row items-center justify-between mt-2">
                                <Text size="xxSmall" tw="text-text_3">
                                    Đã đóng {c.paidCount ?? 0}/
                                    {c.totalHouseholds ?? 0} hộ
                                </Text>
                                <Text size="xxSmall" tw="text-success font-medium">
                                    {formatVnd(c.collectedAmount)}
                                </Text>
                            </Box>
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
                        navigate(ROUTES.INCOME_CREATE, {
                            animate: true,
                            direction: "forward",
                        })
                    }
                >
                    Tạo đợt thu
                </Button>
            </Box>
        </PageLayout>
    );
};

export default IncomePage;
