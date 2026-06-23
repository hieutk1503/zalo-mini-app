import React, { useEffect, useMemo, useState } from "react";
import { Box, Input, Text, useNavigate } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import debounce from "lodash.debounce";
import PageLayout from "@components/layout/PageLayout";
import { EmptyDataContainer } from "@components/common";
import { useStore } from "@store";
import { formatDate } from "@utils/date-time";

const Item = styled.div`
    ${tw`bg-white rounded-lg p-4 mb-3 border border-devider_1 flex flex-row items-start`}
`;
const FileBadge = styled.div`
    ${tw`bg-blue_10 text-main text-[11px] font-medium rounded px-2 py-1 mr-3 whitespace-nowrap`}
`;

/**
 * Kho mẫu đơn, tờ khai — tái dùng kho văn bản nhưng cố định loại "form".
 */
const FormsPage: React.FC = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [documents, getDocuments, loading] = useStore(state => [
        state.documents,
        state.getDocuments,
        state.gettingDocuments,
    ]);

    const fetchData = useMemo(
        () =>
            debounce((kw: string) => {
                getDocuments({ keyword: kw, type: "form" });
            }, 350),
        [getDocuments],
    );

    useEffect(() => {
        fetchData(keyword);
        return () => fetchData.cancel();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyword]);

    const data = documents?.documents || [];

    return (
        <PageLayout title="Kho mẫu đơn, tờ khai" id="forms-page">
            <Box p={4} tw="bg-white">
                <Input.Search
                    placeholder="Tìm mẫu đơn, tờ khai"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    clearable
                />
            </Box>

            <Box p={4}>
                {!loading && data.length === 0 ? (
                    <EmptyDataContainer emptyText="Chưa có mẫu đơn phù hợp" />
                ) : (
                    data.map(item => (
                        <Item
                            key={item.id}
                            onClick={() =>
                                navigate(`/forms/${item.id}`, {
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

export default FormsPage;
