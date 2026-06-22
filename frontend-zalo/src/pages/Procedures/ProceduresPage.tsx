import React, { useEffect, useMemo, useState } from "react";
import { Box, Input, Text, useNavigate } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import debounce from "lodash.debounce";
import PageLayout from "@components/layout/PageLayout";
import { EmptyDataContainer } from "@components/common";
import { useStore } from "@store";
import { ROUTES } from "@constants/common";

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

const CATEGORIES = [
    "Tất cả",
    "Tư pháp - Hộ tịch",
    "Chứng thực",
    "Cư trú",
    "Kinh doanh",
];

const ProceduresPage: React.FC = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState("Tất cả");

    const [procedures, getProcedures, loading] = useStore(state => [
        state.procedures,
        state.getProcedures,
        state.gettingProcedures,
    ]);

    const fetchData = useMemo(
        () =>
            debounce((kw: string, cat: string) => {
                getProcedures({
                    keyword: kw,
                    category: cat === "Tất cả" ? undefined : cat,
                });
            }, 350),
        [getProcedures],
    );

    useEffect(() => {
        fetchData(keyword, category);
        return () => fetchData.cancel();
    }, [keyword, category]);

    const data = procedures?.procedures || [];

    return (
        <PageLayout title="Thủ tục hành chính" id="procedures-page">
            <Box p={4} tw="bg-white">
                <Input.Search
                    placeholder="Tìm theo tên hoặc mã thủ tục"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    clearable
                />
                <Box mt={3} tw="flex flex-row flex-wrap">
                    {CATEGORIES.map(cat => (
                        <Chip
                            key={cat}
                            $active={category === cat}
                            onClick={() => setCategory(cat)}
                        >
                            {cat}
                        </Chip>
                    ))}
                </Box>
            </Box>

            <Box p={4}>
                {!loading && data.length === 0 ? (
                    <EmptyDataContainer emptyText="Không tìm thấy thủ tục phù hợp" />
                ) : (
                    data.map(item => (
                        <Item
                            key={item.id}
                            onClick={() =>
                                navigate(`${ROUTES.PROCEDURES}/${item.id}`, {
                                    animate: true,
                                    direction: "forward",
                                })
                            }
                        >
                            <Text size="small" tw="text-main font-medium">
                                {item.code}
                            </Text>
                            <Text tw="text-text_1 font-medium mt-1">
                                {item.name}
                            </Text>
                            <Text size="small" tw="text-text_2 mt-1">
                                {item.category}
                                {item.agency ? ` · ${item.agency}` : ""}
                            </Text>
                        </Item>
                    ))
                )}
            </Box>
        </PageLayout>
    );
};

export default ProceduresPage;
