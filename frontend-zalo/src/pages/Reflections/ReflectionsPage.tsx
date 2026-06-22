import React, { useEffect, useMemo, useState } from "react";
import { Box, Text, useNavigate } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import {
    DataList,
    FilterBar,
    StatusBadge,
    StatusTabs,
} from "@components/common";
import { useStore } from "@store";
import { ROUTES } from "@constants/common";
import { REFLECTION_STATUS_LABEL } from "@constants/reflection";
import { Reflection } from "@dts";
import { matchKeyword } from "@utils/string";

const Item = styled.div`
    ${tw`bg-ui_bg rounded-lg p-4 mb-3 border border-border`}
`;

const TypeChip = styled.span`
    ${tw`text-[11px] font-medium rounded px-2 py-0.5 bg-primary_50 text-main`}
`;

const TABS = [
    { label: "Chờ xử lý", value: "pending" },
    { label: "Đang xử lý", value: "processing" },
    { label: "Chuyển tiếp", value: "forwarded" },
    { label: "Đã xử lý", value: "completed" },
    { label: "Tất cả", value: undefined as string | undefined },
];

const viDate = (value?: string) =>
    value ? value.split("-").reverse().join("/") : "—";

const ReflectionsPage: React.FC = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState<string | undefined>("pending");

    const [reflections, getReflections, loading, error] = useStore(state => [
        state.reflections,
        state.getReflections,
        state.gettingReflections,
        state.reflectionsError,
    ]);

    const load = () => getReflections({ limit: 500 });

    useEffect(() => {
        load();
    }, []);

    const all = reflections?.reflections || [];

    const filtered = useMemo(
        () =>
            all
                .filter(r => (status ? r.status === status : true))
                .filter(r =>
                    keyword
                        ? matchKeyword(keyword, [
                              r.code,
                              r.title,
                              r.typeName,
                              r.senderName,
                          ])
                        : true,
                ),
        [all, status, keyword],
    );

    return (
        <PageLayout title="Xử lý phản ánh" id="reflections-page">
            <FilterBar
                keyword={keyword}
                onKeywordChange={setKeyword}
                placeholder="Tìm theo mã, tiêu đề, người gửi"
            />
            <StatusTabs tabs={TABS} value={status} onChange={setStatus} />

            <Box p={4}>
                <DataList<Reflection>
                    items={filtered}
                    loading={loading}
                    error={error}
                    onRetry={load}
                    keyExtractor={r => r.id}
                    emptyTitle="Không có phản ánh phù hợp"
                    emptyDescription="Các phản ánh theo trạng thái sẽ hiển thị ở đây"
                    renderItem={r => (
                        <Item
                            onClick={() =>
                                navigate(`${ROUTES.REFLECTIONS}/${r.id}`, {
                                    animate: true,
                                    direction: "forward",
                                })
                            }
                        >
                            <Box tw="flex flex-row items-start justify-between">
                                <Text size="small" tw="text-main font-medium">
                                    {r.code}
                                </Text>
                                <StatusBadge
                                    status={r.status}
                                    label={REFLECTION_STATUS_LABEL[r.status]}
                                />
                            </Box>
                            <Text tw="text-text_1 font-medium mt-0.5">
                                {r.title}
                            </Text>
                            <Box mt={1}>
                                <TypeChip>{r.typeName}</TypeChip>
                            </Box>
                            <Text size="xxSmall" tw="text-text_2 mt-2">
                                {r.senderName}
                                {r.neighborhoodGroup
                                    ? ` · ${r.neighborhoodGroup}`
                                    : ""}{" "}
                                · {viDate(r.createdAt)}
                            </Text>
                        </Item>
                    )}
                />
            </Box>
        </PageLayout>
    );
};

export default ReflectionsPage;
