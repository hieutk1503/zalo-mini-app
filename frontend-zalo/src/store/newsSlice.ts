import { StateCreator } from "zustand";
import { NewsArticle, NewsArticles, NewsComment, NewsCategory } from "@dts";
import { api } from "@service";
import { TOTAL_NEWS_PER_PAGE } from "@constants/common";
import { OrganizationSlice } from "./organizationSlice";

export interface GetNewsArgs {
    page?: number;
    limit?: number;
    keyword?: string;
    category?: string;
    append?: boolean;
}

export interface NewsSlice {
    newsArticles?: NewsArticles;
    gettingNews?: boolean;
    newsError?: boolean;
    newsArticleDetail?: NewsArticle | null;
    gettingNewsDetail?: boolean;
    newsComments?: NewsComment[];
    gettingNewsComments?: boolean;
    postingComment?: boolean;
    newsCategories?: NewsCategory[];
    getNewsArticles: (args?: GetNewsArgs) => Promise<void>;
    getNewsCategories: () => Promise<void>;
    getNewsArticleDetail: (id: string) => Promise<void>;
    getNewsComments: (id: string) => Promise<void>;
    postNewsComment: (
        id: string,
        content: string,
        authorName?: string,
    ) => Promise<boolean>;
}

const newsSlice: StateCreator<
    NewsSlice & OrganizationSlice,
    [],
    [],
    NewsSlice
> = (set, get) => ({
    getNewsCategories: async () => {
        try {
            const cats = await api.getNewsCategories();
            set(state => ({ ...state, newsCategories: cats || [] }));
        } catch (e) {
            set(state => ({ ...state, newsCategories: [] }));
        }
    },
    getNewsArticles: async (args = {}) => {
        const organizationId = get().organization?.id;
        const {
            page = 0,
            limit = TOTAL_NEWS_PER_PAGE,
            keyword,
            category,
            append,
        } = args;
        try {
            set(state => ({ ...state, gettingNews: true, newsError: false }));
            const result = await api.getNewsArticles({
                organizationId,
                page,
                limit,
                keyword,
                category,
            });
            set(state => ({
                ...state,
                newsArticles: {
                    ...result,
                    articles: append
                        ? [
                              ...(state.newsArticles?.articles || []),
                              ...result.articles,
                          ]
                        : result.articles,
                },
            }));
        } catch (err) {
            set(state => ({ ...state, newsError: true }));
        } finally {
            set(state => ({ ...state, gettingNews: false }));
        }
    },
    getNewsArticleDetail: async (id: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({
                ...state,
                gettingNewsDetail: true,
                newsArticleDetail: undefined,
                newsComments: undefined,
            }));
            const detail = await api.getNewsArticleDetail({
                id,
                organizationId,
            });
            set(state => ({ ...state, newsArticleDetail: detail || null }));
        } catch (err) {
            set(state => ({ ...state, newsArticleDetail: null }));
        } finally {
            set(state => ({ ...state, gettingNewsDetail: false }));
        }
    },
    getNewsComments: async (id: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, gettingNewsComments: true }));
            const list = await api.getNewsComments({ id, organizationId });
            set(state => ({ ...state, newsComments: list }));
        } catch (err) {
            set(state => ({ ...state, newsComments: [] }));
        } finally {
            set(state => ({ ...state, gettingNewsComments: false }));
        }
    },
    postNewsComment: async (id: string, content: string, authorName?: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, postingComment: true }));
            const created = await api.postNewsComment({
                id,
                content,
                authorName,
                organizationId,
            });
            if (created) {
                set(state => ({
                    ...state,
                    newsComments: [...(state.newsComments || []), created],
                }));
            }
            return !!created;
        } catch (err) {
            return false;
        } finally {
            set(state => ({ ...state, postingComment: false }));
        }
    },
});

export default newsSlice;
