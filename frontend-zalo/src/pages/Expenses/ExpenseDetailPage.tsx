import React, { useEffect } from "react";
import { Box, Icon, Text, useNavigate, useParams } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { EmptyState, MetaBadge, SectionCard } from "@components/common";
import { useStore } from "@store";
import { EXPENSE_STATUS_META, formatVnd } from "@constants/finance";

const Row = styled.div`
    ${tw`flex flex-row justify-between items-start py-2 border-b border-divider_01`}
    &:last-child {
        border-bottom: none;
    }
`;

const LoadingBlock = styled.div`
    ${tw`bg-ng_10 rounded-lg`}
    height: 200px;
`;

const viDate = (value?: string) =>
    value ? value.split("-").reverse().join("/") : "—";

const InfoRow: React.FC<{ label: string; value?: React.ReactNode }> = ({
    label,
    value,
}) => (
    <Row>
        <Text size="small" tw="text-text_2 flex-shrink-0 pr-3">
            {label}
        </Text>
        <Text size="small" tw="text-text_1 text-right font-medium">
            {value || "—"}
        </Text>
    </Row>
);

const ExpenseDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [expense, loading, getDetail] = useStore(state => [
        state.expenseDetail,
        state.gettingExpenseDetail,
        state.getExpenseDetail,
    ]);

    useEffect(() => {
        if (id) {
            getDetail(id);
        }
    }, [id]);

    if (loading) {
        return (
            <PageLayout title="Chi tiết khoản chi" id="expense-loading">
                <Box p={4}>
                    <LoadingBlock />
                </Box>
            </PageLayout>
        );
    }

    if (!expense) {
        return (
            <PageLayout title="Chi tiết khoản chi" id="expense-empty">
                <EmptyState
                    title="Không tìm thấy khoản chi"
                    actionLabel="Quay lại"
                    onAction={() => navigate(-1)}
                />
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Chi tiết khoản chi" id="expense-detail-page">
            <Box p={4} tw="bg-ui_bg mb-2">
                <Box tw="flex flex-row items-start justify-between">
                    <Text.Title size="small" tw="text-text_1 flex-1 pr-2">
                        {expense.name}
                    </Text.Title>
                    <MetaBadge meta={EXPENSE_STATUS_META[expense.status]} />
                </Box>
                <Text
                    tw="text-danger font-semibold mt-2"
                    style={{ fontSize: 20 }}
                >
                    {formatVnd(expense.amount)}
                </Text>
            </Box>

            <Box px={4} style={{ paddingBottom: 24 }}>
                <SectionCard title="Thông tin khoản chi">
                    <InfoRow label="Mục đích" value={expense.purpose} />
                    <InfoRow
                        label="Ngày chi"
                        value={viDate(expense.expenseDate)}
                    />
                    <InfoRow
                        label="Tổ dân phố"
                        value={expense.neighborhoodGroup}
                    />
                    <InfoRow
                        label="Người thực hiện"
                        value={expense.performerName}
                    />
                    <InfoRow label="Nguồn quỹ" value={expense.fundSource} />
                    {expense.note && (
                        <InfoRow label="Ghi chú" value={expense.note} />
                    )}
                </SectionCard>

                <Box mt={3}>
                    <SectionCard title="Chứng từ đính kèm">
                        {(expense.attachments || []).length === 0 && (
                            <Text size="small" tw="text-text_2">
                                Chưa có chứng từ
                            </Text>
                        )}
                        {(expense.attachments || []).map(a => (
                            <Row key={a.id}>
                                <Box tw="flex flex-row items-center flex-1">
                                    <Icon icon="zi-file" size={16} />
                                    <Text size="small" tw="text-text_1 ml-2">
                                        {a.name}
                                    </Text>
                                </Box>
                            </Row>
                        ))}
                    </SectionCard>
                </Box>
            </Box>
        </PageLayout>
    );
};

export default ExpenseDetailPage;
