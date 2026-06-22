import React, { useEffect, useState } from "react";
import { Box, Text, useNavigate, useParams, useSnackbar } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { EmptyState, MetaBadge, SectionCard } from "@components/common";
import { Input } from "@components";
import { useStore } from "@store";
import {
    INCOME_STATUS_META,
    PAYMENT_STATUS_META,
    formatVnd,
} from "@constants/finance";
import { PaymentStatus } from "@dts";

const Row = styled.div`
    ${tw`py-3 border-b border-divider_01`}
    &:last-child {
        border-bottom: none;
    }
`;

const LoadingBlock = styled.div`
    ${tw`bg-ng_10 rounded-lg`}
    height: 220px;
`;

const SmallBtn = styled.button<{ $variant?: "primary" }>`
    ${tw`text-sm rounded-lg border px-3 py-1.5`}
    ${({ $variant }) =>
        $variant === "primary"
            ? tw`bg-main text-white border-main`
            : tw`bg-white text-text_1 border-ng_20`}
`;

const LinkBtn = styled.button`
    ${tw`text-main text-sm`}
`;

const viDate = (value?: string) =>
    value ? value.split("-").reverse().join("/") : "—";

const StatRow: React.FC<{ label: string; value?: React.ReactNode }> = ({
    label,
    value,
}) => (
    <Box tw="flex flex-row justify-between py-1">
        <Text size="small" tw="text-text_2">
            {label}
        </Text>
        <Text size="small" tw="text-text_1 font-medium">
            {value}
        </Text>
    </Box>
);

const IncomeDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { openSnackbar } = useSnackbar();

    const [
        campaign,
        loading,
        getDetail,
        updatePayment,
        updating,
    ] = useStore(state => [
        state.incomeCampaignDetail,
        state.gettingIncomeCampaignDetail,
        state.getIncomeCampaignDetail,
        state.updatePaymentStatus,
        state.updatingPayment,
    ]);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [partial, setPartial] = useState("");

    useEffect(() => {
        if (id) {
            getDetail(id);
        }
    }, [id]);

    const doUpdate = async (
        paymentId: string,
        status: PaymentStatus,
        amount?: number,
    ) => {
        if (!id) return;
        const ok = await updatePayment(id, paymentId, status, amount);
        openSnackbar({
            type: ok ? "success" : "error",
            text: ok ? "Đã cập nhật trạng thái đóng" : "Cập nhật thất bại",
        });
        if (ok) {
            setEditingId(null);
            setPartial("");
        }
    };

    if (loading) {
        return (
            <PageLayout title="Chi tiết đợt thu" id="income-loading">
                <Box p={4}>
                    <LoadingBlock />
                </Box>
            </PageLayout>
        );
    }

    if (!campaign) {
        return (
            <PageLayout title="Chi tiết đợt thu" id="income-empty">
                <EmptyState
                    title="Không tìm thấy đợt thu"
                    actionLabel="Quay lại"
                    onAction={() => navigate(-1)}
                />
            </PageLayout>
        );
    }

    const households = campaign.households || [];

    return (
        <PageLayout title="Chi tiết đợt thu" id="income-detail-page">
            <Box p={4} tw="bg-ui_bg mb-2">
                <Box tw="flex flex-row items-start justify-between">
                    <Text.Title size="small" tw="text-text_1 flex-1 pr-2">
                        {campaign.name}
                    </Text.Title>
                    <MetaBadge meta={INCOME_STATUS_META[campaign.status]} />
                </Box>
                <Text size="small" tw="text-text_2 mt-1">
                    {campaign.feeType}
                    {campaign.neighborhoodGroup
                        ? ` · ${campaign.neighborhoodGroup}`
                        : ""}
                </Text>
            </Box>

            <Box px={4} style={{ paddingBottom: 24 }}>
                <SectionCard title="Tổng quan">
                    <StatRow
                        label="Đã thu / Dự kiến"
                        value={`${formatVnd(campaign.collectedAmount)} / ${formatVnd(
                            campaign.expectedTotal,
                        )}`}
                    />
                    <StatRow
                        label="Số hộ đã đóng"
                        value={`${campaign.paidCount ?? 0}/${
                            campaign.totalHouseholds ?? 0
                        }`}
                    />
                    <StatRow
                        label="Mức đóng / hộ"
                        value={formatVnd(campaign.amountPerHousehold)}
                    />
                    <StatRow
                        label="Thời gian"
                        value={`${viDate(campaign.startDate)} - ${
                            campaign.endDate ? viDate(campaign.endDate) : "…"
                        }`}
                    />
                </SectionCard>

                <Box mt={3}>
                    <SectionCard title={`Danh sách hộ (${households.length})`}>
                        {households.length === 0 && (
                            <Text size="small" tw="text-text_2">
                                Chưa có hộ trong đợt thu
                            </Text>
                        )}
                        {households.map(h => (
                            <Row key={h.id}>
                                <Box tw="flex flex-row items-start justify-between">
                                    <Box tw="flex-1 pr-2">
                                        <Text size="small" tw="text-text_1 font-medium">
                                            {h.householdName}
                                        </Text>
                                        <Text size="xxSmall" tw="text-text_2 mt-0.5">
                                            Phải đóng {formatVnd(h.amountDue)} · Đã
                                            đóng {formatVnd(h.amountPaid)}
                                        </Text>
                                    </Box>
                                    <MetaBadge
                                        small
                                        meta={PAYMENT_STATUS_META[h.status]}
                                    />
                                </Box>
                                <Box tw="flex flex-row justify-end mt-1">
                                    <LinkBtn
                                        type="button"
                                        onClick={() =>
                                            setEditingId(
                                                editingId === h.id ? null : h.id,
                                            )
                                        }
                                    >
                                        {editingId === h.id ? "Đóng" : "Cập nhật"}
                                    </LinkBtn>
                                </Box>

                                {editingId === h.id && (
                                    <Box mt={2} tw="bg-ng_10 rounded-lg p-3">
                                        <Box tw="flex flex-row flex-wrap gap-2">
                                            <SmallBtn
                                                type="button"
                                                $variant="primary"
                                                onClick={() =>
                                                    doUpdate(h.id, "paid")
                                                }
                                            >
                                                Đã đóng đủ
                                            </SmallBtn>
                                            <SmallBtn
                                                type="button"
                                                onClick={() =>
                                                    doUpdate(h.id, "exempt")
                                                }
                                            >
                                                Miễn giảm
                                            </SmallBtn>
                                            <SmallBtn
                                                type="button"
                                                onClick={() =>
                                                    doUpdate(h.id, "unpaid")
                                                }
                                            >
                                                Chưa đóng
                                            </SmallBtn>
                                        </Box>
                                        <Box mt={2}>
                                            <Input
                                                type="number"
                                                placeholder="Số tiền đóng một phần"
                                                value={partial}
                                                onChange={e =>
                                                    setPartial(e.target.value)
                                                }
                                            />
                                            <SmallBtn
                                                type="button"
                                                $variant="primary"
                                                tw="mt-2"
                                                onClick={() => {
                                                    const amt = Number(partial);
                                                    if (!amt || amt <= 0) {
                                                        openSnackbar({
                                                            type: "warning",
                                                            text: "Nhập số tiền hợp lệ",
                                                        });
                                                        return;
                                                    }
                                                    doUpdate(
                                                        h.id,
                                                        "partial",
                                                        amt,
                                                    );
                                                }}
                                            >
                                                Lưu đóng một phần
                                            </SmallBtn>
                                        </Box>
                                    </Box>
                                )}
                            </Row>
                        ))}
                    </SectionCard>
                </Box>

                {updating && (
                    <Text size="xxSmall" tw="text-text_3 mt-2 text-center">
                        Đang cập nhật…
                    </Text>
                )}
            </Box>
        </PageLayout>
    );
};

export default IncomeDetailPage;
