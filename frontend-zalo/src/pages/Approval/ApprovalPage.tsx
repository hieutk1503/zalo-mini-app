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
import { ApprovalRequest, ApprovalTargetType } from "@dts";
import { matchKeyword } from "@utils/string";

const Item = styled.div`
    ${tw`bg-ui_bg rounded-lg p-4 mb-3 border border-border`}
`;

const TypeTag = styled.span<{ $resident: boolean }>`
    ${tw`text-[11px] font-medium rounded px-2 py-0.5 mr-2`}
    ${({ $resident }) =>
        $resident ? tw`bg-primary_50 text-main` : tw`bg-info_50 text-info`}
`;

const TABS = [
    { label: "Chờ duyệt", value: "pending" },
    { label: "Đã duyệt", value: "approved" },
    { label: "Từ chối", value: "rejected" },
    { label: "Tất cả", value: undefined as string | undefined },
];

const viDate = (value?: string) =>
    value ? value.split("-").reverse().join("/") : "—";

interface ApprovalPageProps {
    targetType: ApprovalTargetType;
}

const ApprovalPage: React.FC<ApprovalPageProps> = ({ targetType }) => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState<string | undefined>("pending");

    const [approvalRequests, getApprovalRequests, loading, error] = useStore(
        state => [
            state.approvalRequests,
            state.getApprovalRequests,
            state.gettingApprovalRequests,
            state.approvalRequestsError,
        ],
    );

    const load = () => getApprovalRequests({ limit: 500 });

    useEffect(() => {
        load();
    }, []);

    const all = approvalRequests?.requests || [];

    const filtered = useMemo(
        () =>
            all
                .filter(a => a.targetType === targetType)
                .filter(a => (status ? a.status === status : true))
                .filter(a =>
                    keyword
                        ? matchKeyword(keyword, [
                              a.targetName,
                              a.requesterName,
                              a.summary,
                          ])
                        : true,
                ),
        [all, targetType, status, keyword],
    );

    const title = targetType === "resident" ? "Duyệt cư dân" : "Duyệt hộ dân";

    return (
        <PageLayout title={title} id="approval-page">
            <FilterBar
                keyword={keyword}
                onKeywordChange={setKeyword}
                placeholder="Tìm theo tên, người gửi, nội dung"
            />

            <StatusTabs tabs={TABS} value={status} onChange={setStatus} />

            <Box p={4}>
                <DataList<ApprovalRequest>
                    items={filtered}
                    loading={loading}
                    error={error}
                    onRetry={load}
                    keyExtractor={a => a.id}
                    emptyTitle="Không có yêu cầu phù hợp"
                    emptyDescription="Các yêu cầu chờ duyệt sẽ hiển thị ở đây"
                    renderItem={a => (
                        <Item
                            onClick={() =>
                                navigate(`/approval/detail/${a.id}`, {
                                    animate: true,
                                    direction: "forward",
                                })
                            }
                        >
                            <Box tw="flex flex-row items-start justify-between">
                                <Box tw="flex-1 pr-2">
                                    <TypeTag
                                        $resident={a.targetType === "resident"}
                                    >
                                        {a.targetType === "resident"
                                            ? "Cư dân"
                                            : "Hộ dân"}
                                    </TypeTag>
                                    <Text tw="text-text_1 font-medium mt-1">
                                        {a.targetName}
                                    </Text>
                                </Box>
                                <StatusBadge status={a.status} />
                            </Box>
                            <Text size="small" tw="text-text_2 mt-1">
                                {a.summary}
                            </Text>
                            <Text size="xxSmall" tw="text-text_2 mt-1">
                                Người gửi: {a.requesterName}
                                {a.neighborhoodGroup
                                    ? ` · ${a.neighborhoodGroup}`
                                    : ""}{" "}
                                · {viDate(a.submittedAt)}
                            </Text>
                        </Item>
                    )}
                />
            </Box>
        </PageLayout>
    );
};

export default ApprovalPage;
