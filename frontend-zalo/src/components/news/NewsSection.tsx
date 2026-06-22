import React, { FC, useEffect, useRef } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import { Box, Text, useNavigate } from "zmp-ui";
import { ROUTES, TOTAL_ARTICLES_PER_PAGE } from "@constants/common";
import { useStore } from "@store";
import NewsList from "./NewsList";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NewsProps {}

const Wrapper = styled(Box)`
    ${tw`bg-ui_bg mb-5`};
`;

const NewsSection: FC<NewsProps> = () => {
    const navigate = useNavigate();
    const [articles, getArticles, loading] = useStore(state => [
        state.articles,
        state.getArticles,
        state.gettingArticles,
    ]);
    const listRef = useRef<HTMLDivElement>(null);
    const { id: orgId } = useStore(state => state.organization) || {
        id: "",
    };
    const { articles: data = [] } = articles || {};

    useEffect(() => {
        if (orgId && !articles) {
            getArticles({
                organizationId: orgId,
                page: 0,
                limit: TOTAL_ARTICLES_PER_PAGE,
            });
        }
    }, [orgId]);

    return (
        <Wrapper p={4} mt={2}>
            <Box tw="flex flex-row items-center justify-between">
                <Text.Title size="small">Tin tức - Sự kiện</Text.Title>
                <button
                    type="button"
                    tw="text-main text-sm"
                    onClick={() =>
                        navigate(ROUTES.NEWS, {
                            animate: true,
                            direction: "forward",
                        })
                    }
                >
                    Xem tất cả
                </button>
            </Box>

            <NewsList ref={listRef} loading={loading} data={data} />
        </Wrapper>
    );
};

export default NewsSection;
