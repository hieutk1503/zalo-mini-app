import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Text, useNavigate } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { DataList, FilterBar, MetaBadge } from "@components/common";
import { useStore } from "@store";
import { ROUTES } from "@constants/common";
import { EXPENSE_STATUS_META, formatVnd } from "@constants/finance";
import { ExpenseRecord } from "@dts";
import { matchKeyword } from "@utils/string";

const Item = styled.div`
    ${tw`bg-ui_bg rounded-lg p-4 mb-3 border border-border`}
`;

const Kpi = styled.div`
    ${tw`bg-ui_bg rounded-lg p-4 border border-border`}
`;

const viDate = (value?: string) =>
    value ? value.split("-").reverse().join("/") : "—";

const ExpensesPage: React.FC = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");

    const [expenses, getExpenses, loading, error] = useStore(state => [
        state.expenses,
        state.getExpenses,
        state.gettingExpenses,
        state.expensesError,
    ]);

    const load = () => getExpenses({ limit: 500 });

    useEffect(() => {
        load();
    }, []);

    const all = expenses?.expenses || [];

    const totalSpent = useMemo(
        () => all.reduce((s, e) => s + (e.amount || 0), 0),
        [all],
    );

    const filtered = useMemo(
        () =>
            all.filter(e =>
                keyword
                    ? matchKeyword(keyword, [e.name, e.purpose, e.fundSource])
                    : true,
            ),
        [all, keyword],
    );

    return (
        <PageLayout title="Quản lý chi" id="expenses-page">
            <Box p={4} tw="bg-ui_bg">
                <Kpi>
                    <Text size="xxSmall" tw="text-text_2">
                        Tổng đã chi
                    </Text>
                    <Text
                        tw="text-danger font-semibold mt-1"
                        style={{ fontSize: 22 }}
                    >
                        {formatVnd(totalSpent)}
                    </Text>
                    <Text size="xxSmall" tw="text-text_3 mt-1">
                        {all.length} khoản chi
                    </Text>
                </Kpi>
            </Box>

            <FilterBar
                keyword={keyword}
                onKeywordChange={setKeyword}
                placeholder="Tìm theo tên, mục đích khoản chi"
            />

            <Box p={4}>
                <DataList<ExpenseRecord>
                    items={filtered}
                    loading={loading}
                    error={error}
                    onRetry={load}
                    keyExtractor={e => e.id}
                    emptyTitle="Chưa có khoản chi"
                    emptyDescription="Ghi nhận khoản chi để công khai minh bạch"
                    renderItem={e => (
                        <Item
                            onClick={() =>
                                navigate(`${ROUTES.EXPENSES}/${e.id}`, {
                                    animate: true,
                                    direction: "forward",
                                })
                            }
                        >
                            <Box tw="flex flex-row items-start justify-between">
                                <Text tw="text-text_1 font-medium flex-1 pr-2">
                                    {e.name}
                                </Text>
                                <MetaBadge
                                    meta={EXPENSE_STATUS_META[e.status]}
                                />
                            </Box>
                            <Text size="small" tw="text-text_2 mt-1">
                                {e.purpose}
                            </Text>
                            <Box tw="flex flex-row items-center justify-between mt-2">
                                <Text size="xxSmall" tw="text-text_3">
                                    {viDate(e.expenseDate)}
                                    {e.neighborhoodGroup
                                        ? ` · ${e.neighborhoodGroup}`
                                        : ""}
                                </Text>
                                <Text
                                    size="xxSmall"
                                    tw="text-danger font-medium"
                                >
                                    {formatVnd(e.amount)}
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
                        navigate(ROUTES.EXPENSE_CREATE, {
                            animate: true,
                            direction: "forward",
                        })
                    }
                >
                    Tạo khoản chi
                </Button>
            </Box>
        </PageLayout>
    );
};

export default ExpensesPage;
