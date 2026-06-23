import React, { useEffect, useMemo, useState } from "react";
import { Box, Input, Text, useNavigate } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import debounce from "lodash.debounce";
import PageLayout from "@components/layout/PageLayout";
import { EmptyDataContainer } from "@components/common";
import { useStore } from "@store";
import { ROUTES, LEGAL_FIELDS, LEGAL_STATUS_LABEL } from "@constants/common";
import { formatDate } from "@utils/date-time";

const Chip = styled.button<{ $active: boolean }>`
    ${tw`px-3 py-1 rounded-full text-sm mr-2 mb-2 whitespace-nowrap border`}
    ${({ $active }) =>
        $active
            ? tw`bg-main text-white border-main`
            : tw`bg-white text-text_2 border-ng_20`}
`;

const Item = styled.div`
    ${tw`bg-white rounded-lg p-4 mb-3 border border-devider_1`}
`;

const TypeBadge = styled.div`
    ${tw`bg-blue_10 text-main text-[11px] font-medium rounded px-2 py-1 mr-2 whitespace-nowrap`}
`;

const StatusBadge = styled.span<{ $status?: string }>`
    ${tw`text-[11px] font-medium rounded px-2 py-1 whitespace-nowrap`}
    ${({ $status }) => {
        if ($status === "active") return tw`bg-green-50 text-green-700`;
        if ($status === "expired") return tw`bg-red-50 text-red-600`;
        return tw`bg-amber-50 text-amber-700`;
    }}
`;

const STATUS_TABS = [
    { label: "Tất cả", value: undefined as string | undefined },
    { label: "Còn hiệu lực", value: "active" },
    { label: "Hết hiệu lực", value: "expired" },
    { label: "Sửa đổi, bổ sung", value: "amended" },
];

const LegalLibraryPage: React.FC = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [field, setField] = useState<string | undefined>(undefined);
    const [status, setStatus] = useState<string | undefined>(undefined);

    const [legalDocuments, getLegalDocuments, loading] = useStore(state => [
        state.legalDocuments,
        state.getLegalDocuments,
        state.gettingLegalDocuments,
    ]);

    const fetchData = useMemo(
        () =>
            debounce((kw: string, f?: string, st?: string) => {
                getLegalDocuments({ keyword: kw, field: f, status: st });
            }, 350),
        [getLegalDocuments],
    );

    useEffect(() => {
        fetchData(keyword, field, status);
        return () => fetchData.cancel();
    }, [keyword, field, status]);

    const data = legalDocuments?.legalDocuments || [];

    return (
        <PageLayout title="Thư viện pháp luật" id="legal-library-page">
            <Box p={4} tw="bg-white">
                <Input.Search
                    placeholder="Tìm theo số hiệu, tiêu đề, lĩnh vực"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    clearable
                />
                <Box mt={3} tw="flex flex-row flex-wrap">
                    {STATUS_TABS.map(tab => (
                        <Chip
                            key={tab.label}
                            $active={status === tab.value}
                            onClick={() => setStatus(tab.value)}
                        >
                            {tab.label}
                        </Chip>
                    ))}
                </Box>
                <Box tw="flex flex-row flex-wrap mt-1">
                    <Chip
                        $active={field === undefined}
                        onClick={() => setField(undefined)}
                    >
                        Tất cả lĩnh vực
                    </Chip>
                    {LEGAL_FIELDS.map(f => (
                        <Chip
                            key={f}
                            $active={field === f}
                            onClick={() => setField(f)}
                        >
                            {f}
                        </Chip>
                    ))}
                </Box>
            </Box>

            <Box p={4}>
                {!loading && data.length === 0 ? (
                    <EmptyDataContainer emptyText="Không tìm thấy văn bản phù hợp" />
                ) : (
                    data.map(item => (
                        <Item
                            key={item.id}
                            onClick={() =>
                                navigate(`${ROUTES.LEGAL_LIBRARY}/${item.id}`, {
                                    animate: true,
                                    direction: "forward",
                                })
                            }
                        >
                            <Box tw="flex flex-row items-center mb-1">
                                <TypeBadge>
                                    {item.docType || "Văn bản"}
                                </TypeBadge>
                                {item.status && (
                                    <StatusBadge $status={item.status}>
                                        {LEGAL_STATUS_LABEL[item.status]}
                                    </StatusBadge>
                                )}
                            </Box>
                            {item.docNo && (
                                <Text size="small" tw="text-main font-medium">
                                    {item.docNo}
                                </Text>
                            )}
                            <Text tw="text-text_1 font-medium mt-0.5">
                                {item.title}
                            </Text>
                            <Text size="small" tw="text-text_2 mt-1">
                                {item.field}
                                {item.issuedDate
                                    ? ` · ${formatDate(
                                          item.issuedDate,
                                          "dd/mm/yyyy",
                                      )}`
                                    : ""}
                            </Text>
                        </Item>
                    ))
                )}
            </Box>
        </PageLayout>
    );
};

export default LegalLibraryPage;
