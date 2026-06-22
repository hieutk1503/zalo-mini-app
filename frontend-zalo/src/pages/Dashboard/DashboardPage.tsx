import React, { useEffect, useMemo } from "react";
import { Box, Icon, Text, useNavigate } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { MetaBadge, SectionCard, SummaryCards } from "@components/common";
import { useStore } from "@store";
import { ROUTES } from "@constants/common";
import { REFLECTION_STATUS_LABEL } from "@constants/reflection";
import { formatVnd } from "@constants/finance";
import { ReflectionStatus } from "@dts";
import { STATUS_META } from "@constants/status";

const Row = styled.div`
    ${tw`flex flex-row items-center justify-between py-2 border-b border-divider_01`}
    &:last-child {
        border-bottom: none;
    }
`;

const LinkRow = styled.div`
    ${tw`flex flex-row items-center py-3 border-b border-divider_01`}
    &:last-child {
        border-bottom: none;
    }
`;

const REFLECTION_ORDER: ReflectionStatus[] = [
    "pending",
    "processing",
    "forwarded",
    "completed",
];

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();

    const [
        residents,
        households,
        reflections,
        incomeCampaigns,
        expenses,
        surveyCampaigns,
        contests,
        meetings,
    ] = useStore(state => [
        state.residents,
        state.households,
        state.reflections,
        state.incomeCampaigns,
        state.expenses,
        state.surveyCampaigns,
        state.contests,
        state.meetings,
    ]);

    const [
        getResidents,
        getHouseholds,
        getReflections,
        getIncomeCampaigns,
        getExpenses,
        getSurveyCampaigns,
        getContests,
        getMeetings,
    ] = useStore(state => [
        state.getResidents,
        state.getHouseholds,
        state.getReflections,
        state.getIncomeCampaigns,
        state.getExpenses,
        state.getSurveyCampaigns,
        state.getContests,
        state.getMeetings,
    ]);

    useEffect(() => {
        getResidents({ limit: 500 });
        getHouseholds({ limit: 500 });
        getReflections({ limit: 500 });
        getIncomeCampaigns({ limit: 500 });
        getExpenses({ limit: 500 });
        getSurveyCampaigns({ limit: 500 });
        getContests({ limit: 500 });
        getMeetings({ limit: 500 });
    }, []);

    const stats = useMemo(() => {
        const r = residents?.residents || [];
        const h = households?.households || [];
        const f = reflections?.reflections || [];
        const inc = incomeCampaigns?.campaigns || [];
        const exp = expenses?.expenses || [];
        const sv = surveyCampaigns?.surveys || [];
        const ct = contests?.contests || [];
        const mt = meetings?.meetings || [];

        const countBy = <T,>(arr: T[], pred: (x: T) => boolean) =>
            arr.filter(pred).length;

        return {
            residentTotal: r.length,
            residentPending: countBy(r, x => x.status === "pending"),
            householdTotal: h.length,
            householdPending: countBy(h, x => x.status === "pending"),
            reflectionBy: REFLECTION_ORDER.map(s => ({
                status: s,
                count: countBy(f, x => x.status === s),
            })),
            totalCollected: inc.reduce(
                (s, c) => s + (c.collectedAmount || 0),
                0,
            ),
            totalSpent: exp.reduce((s, e) => s + (e.amount || 0), 0),
            openSurveys: countBy(sv, x => x.status === "active"),
            activeContests: countBy(ct, x => x.status === "active"),
            upcomingMeetings: countBy(mt, x => x.status === "scheduled"),
        };
    }, [
        residents,
        households,
        reflections,
        incomeCampaigns,
        expenses,
        surveyCampaigns,
        contests,
        meetings,
    ]);

    return (
        <PageLayout title="Tổng quan khu phố" id="dashboard-page">
            <Box p={4} tw="bg-ui_bg mb-2">
                <SummaryCards
                    items={[
                        { label: "Cư dân", value: stats.residentTotal },
                        { label: "Hộ dân", value: stats.householdTotal },
                        {
                            label: "CD chờ duyệt",
                            value: stats.residentPending,
                            color: "#F59E0B",
                        },
                        {
                            label: "Hộ chờ duyệt",
                            value: stats.householdPending,
                            color: "#F59E0B",
                        },
                    ]}
                />
            </Box>

            <Box px={4} style={{ paddingBottom: 24 }}>
                <SectionCard title="Phản ánh theo trạng thái">
                    {stats.reflectionBy.map(item => (
                        <Row key={item.status}>
                            <MetaBadge
                                small
                                meta={{
                                    label: REFLECTION_STATUS_LABEL[item.status],
                                    color: STATUS_META[item.status].color,
                                    bg: STATUS_META[item.status].bg,
                                }}
                            />
                            <Text size="small" tw="text-text_1 font-medium">
                                {item.count}
                            </Text>
                        </Row>
                    ))}
                </SectionCard>

                <Box mt={3}>
                    <SectionCard title="Thu / chi khu phố">
                        <Row>
                            <Text size="small" tw="text-text_2">
                                Tổng đã thu
                            </Text>
                            <Text size="small" tw="text-success font-semibold">
                                {formatVnd(stats.totalCollected)}
                            </Text>
                        </Row>
                        <Row>
                            <Text size="small" tw="text-text_2">
                                Tổng đã chi
                            </Text>
                            <Text size="small" tw="text-danger font-semibold">
                                {formatVnd(stats.totalSpent)}
                            </Text>
                        </Row>
                    </SectionCard>
                </Box>

                <Box mt={3}>
                    <SectionCard title="Hoạt động đang mở">
                        <Row>
                            <Text size="small" tw="text-text_2">
                                Khảo sát đang mở
                            </Text>
                            <Text size="small" tw="text-text_1 font-medium">
                                {stats.openSurveys}
                            </Text>
                        </Row>
                        <Row>
                            <Text size="small" tw="text-text_2">
                                Cuộc thi đang mở
                            </Text>
                            <Text size="small" tw="text-text_1 font-medium">
                                {stats.activeContests}
                            </Text>
                        </Row>
                        <Row>
                            <Text size="small" tw="text-text_2">
                                Cuộc họp sắp diễn ra
                            </Text>
                            <Text size="small" tw="text-text_1 font-medium">
                                {stats.upcomingMeetings}
                            </Text>
                        </Row>
                    </SectionCard>
                </Box>

                <Box mt={3}>
                    <SectionCard title="Phân hệ DSS (trên Web Admin)">
                        <LinkRow onClick={() => navigate(ROUTES.REPORT_ENTRY)}>
                            <Icon icon="zi-note" size={20} tw="text-main" />
                            <Text size="small" tw="text-text_1 ml-2 flex-1">
                                Nhập liệu báo cáo DSS
                            </Text>
                            <Icon
                                icon="zi-chevron-right"
                                size={18}
                                tw="text-text_3"
                            />
                        </LinkRow>
                        <LinkRow onClick={() => navigate(ROUTES.MEETING_ROOM)}>
                            <Icon icon="zi-group" size={20} tw="text-main" />
                            <Text size="small" tw="text-text_1 ml-2 flex-1">
                                Phòng họp số
                            </Text>
                            <Icon
                                icon="zi-chevron-right"
                                size={18}
                                tw="text-text_3"
                            />
                        </LinkRow>
                    </SectionCard>
                </Box>

                <Text size="xxSmall" tw="text-text_3 mt-3 text-center">
                    Số liệu tổng hợp từ dữ liệu khu phố (chỉ để xem).
                </Text>
            </Box>
        </PageLayout>
    );
};

export default DashboardPage;
