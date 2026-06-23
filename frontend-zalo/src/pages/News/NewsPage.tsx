import React, { useEffect, useMemo, useState } from "react";
import { Box, Text, useNavigate } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { DataList, FilterBar, StatusTabs } from "@components/common";
import { useStore } from "@store";
import { ROUTES, NEWS_CATEGORIES } from "@constants/common";
import { NewsArticle } from "@dts";
import { matchKeyword } from "@utils/string";
import Thumb from "@assets/thumb.png";

const Item = styled.div`
    ${tw`bg-ui_bg rounded-lg p-3 mb-3 border border-border flex flex-row`}
`;

const Thumbnail = styled.img`
    ${tw`rounded-lg bg-ng_10 object-cover flex-shrink-0`}
    width: 84px;
    height: 84px;
`;

const CategoryChip = styled.span`
    ${tw`text-[11px] font-medium rounded px-2 py-0.5 bg-primary_50 text-main`}
`;

const Title2 = styled(Text)`
    ${tw`text-text_1 font-medium`}
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const viDate = (value?: string) =>
    value ? value.split("-").reverse().join("/") : "—";

const NewsPage: React.FC = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState<string | undefined>(undefined);

    const [
        newsArticles,
        getNewsArticles,
        loading,
        error,
        newsCategories,
        getNewsCategories,
    ] = useStore(state => [
        state.newsArticles,
        state.getNewsArticles,
        state.gettingNews,
        state.newsError,
        state.newsCategories,
        state.getNewsCategories,
    ]);

    const load = () => getNewsArticles({ limit: 500 });

    useEffect(() => {
        load();
        getNewsCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const tabs = useMemo(() => {
        const names =
            newsCategories && newsCategories.length
                ? newsCategories.map(c => c.name)
                : NEWS_CATEGORIES;
        return [
            { label: "Tất cả", value: undefined as string | undefined },
            ...names.map(c => ({ label: c, value: c })),
        ];
    }, [newsCategories]);

    const all = newsArticles?.articles || [];

    const filtered = useMemo(
        () =>
            all
                .filter(a => (category ? a.category === category : true))
                .filter(a =>
                    keyword
                        ? matchKeyword(keyword, [
                              a.title,
                              a.summary,
                              a.category,
                          ])
                        : true,
                ),
        [all, category, keyword],
    );

    return (
        <PageLayout title="Tin tức" id="news-page">
            <FilterBar
                keyword={keyword}
                onKeywordChange={setKeyword}
                placeholder="Tìm tin tức"
            />
            <StatusTabs tabs={tabs} value={category} onChange={setCategory} />

            <Box p={4}>
                <DataList<NewsArticle>
                    items={filtered}
                    loading={loading}
                    error={error}
                    onRetry={load}
                    keyExtractor={a => a.id}
                    emptyTitle="Chưa có tin tức"
                    renderItem={a => (
                        <Item
                            onClick={() =>
                                navigate(`${ROUTES.NEWS}/${a.id}`, {
                                    animate: true,
                                    direction: "forward",
                                })
                            }
                        >
                            <Thumbnail src={a.thumbnailUrl || Thumb} />
                            <Box tw="flex-1 ml-3 overflow-hidden">
                                {a.category && (
                                    <CategoryChip>{a.category}</CategoryChip>
                                )}
                                <Title2 size="small" tw="mt-1">
                                    {a.title}
                                </Title2>
                                <Text size="xxSmall" tw="text-text_2 mt-1">
                                    {viDate(a.publishedAt)}
                                    {a.source ? ` · ${a.source}` : ""} ·{" "}
                                    {a.commentCount ?? 0} bình luận
                                </Text>
                            </Box>
                        </Item>
                    )}
                />
            </Box>
        </PageLayout>
    );
};

export default NewsPage;
