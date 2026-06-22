import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { Box, Input, Text, useNavigate } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import debounce from "lodash.debounce";
import PageLayout from "@components/layout/PageLayout";
import { EmptyDataContainer } from "@components/common";
import { useStore } from "@store";
import { ROUTES } from "@constants/common";
import { PublicDocumentType } from "@dts";
import { formatDate } from "@utils/date-time";

const Chip = styled.button<{ $active: boolean }>`
    ${tw`px-3 py-1 rounded-full text-sm mr-2 mb-2 whitespace-nowrap border`}
    ${({ $active }) =>
        $active
            ? tw`bg-main text-white border-main`
            : tw`bg-white text-text_2 border-ng_20`}
`;

const Item = styled.div`
    ${tw`bg-white rounded-lg p-4 mb-3 border border-devider_1 flex flex-row items-start`}
`;

const FileBadge = styled.div`
    ${tw`bg-blue_10 text-main text-[11px] font-medium rounded px-2 py-1 mr-3 whitespace-nowrap`}
`;

const TABS: { label: string; value?: PublicDocumentType }[] = [
    { label: "Tất cả", value: undefined },
    { label: "Mẫu đơn", value: "form" },
    { label: "NQ Đảng ủy", value: "party_resolution" },
    { label: "NQ HĐND", value: "council_resolution" },
    { label: "Quy hoạch", value: "planning" },
];

const DocumentsPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialType = (location.state as { type?: PublicDocumentType } | null)
        ?.type;
    const [keyword, setKeyword] = useState("");
    const [type, setType] = useState<PublicDocumentType | undefined>(
        initialType,
    );

    const [documents, getDocuments, loading] = useStore(state => [
        state.documents,
        state.getDocuments,
        state.gettingDocuments,
    ]);

    const fetchData = useMemo(
        () =>
            debounce((kw: string, t?: PublicDocumentType) => {
                getDocuments({ keyword: kw, type: t });
            }, 350),
        [getDocuments],
    );

    useEffect(() => {
        fetchData(keyword, type);
        return () => fetchData.cancel();
    }, [keyword, type]);

    const data = documents?.documents || [];

    return (
        <PageLayout title="Văn bản & mẫu đơn" id="documents-page">
            <Box p={4} tw="bg-white">
                <Input.Search
                    placeholder="Tìm theo số hiệu hoặc trích yếu"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    clearable
                />
                <Box mt={3} tw="flex flex-row flex-wrap">
                    {TABS.map(tab => (
                        <Chip
                            key={tab.label}
                            $active={type === tab.value}
                            onClick={() => setType(tab.value)}
                        >
                            {tab.label}
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
                                navigate(`${ROUTES.DOCUMENTS}/${item.id}`, {
                                    animate: true,
                                    direction: "forward",
                                })
                            }
                        >
                            <FileBadge>{item.fileType || "FILE"}</FileBadge>
                            <Box tw="flex-1">
                                {item.documentNo && (
                                    <Text
                                        size="small"
                                        tw="text-main font-medium"
                                    >
                                        {item.documentNo}
                                    </Text>
                                )}
                                <Text tw="text-text_1 font-medium mt-0.5">
                                    {item.title}
                                </Text>
                                <Text size="small" tw="text-text_2 mt-1">
                                    {item.category}
                                    {item.issuedDate
                                        ? ` · ${formatDate(
                                              item.issuedDate,
                                              "dd/mm/yyyy",
                                          )}`
                                        : ""}
                                </Text>
                            </Box>
                        </Item>
                    ))
                )}
            </Box>
        </PageLayout>
    );
};

export default DocumentsPage;
