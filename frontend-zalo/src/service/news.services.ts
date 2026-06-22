/**
 * Service API thật cho Tin tức nội bộ.
 * Cùng chữ ký với news.services.mock để adapter hoán đổi theo môi trường.
 */
import { NewsArticle, NewsArticles, NewsComment, NewsCategory } from "@dts";
import { API } from "@constants/common";
import { generatePath } from "@utils/string";
import { request } from "./request";

const withOrgHeader = (organizationId?: string) =>
    organizationId
        ? { customHeader: { "x-organization-id": organizationId } }
        : undefined;

export interface GetNewsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    category?: string;
}

export const getNewsArticles = async (
    params: GetNewsParams = {},
): Promise<NewsArticles> => {
    const { organizationId, page = 0, limit = 10, ...rest } = params;
    const response = await request<any>(
        "GET",
        API.NEWS,
        { page, pageSize: limit, ...rest },
        withOrgHeader(organizationId),
    );
    // If response is an array (from NestJS), wrap it
    if (Array.isArray(response)) {
        const mappedArticles = response.map((a: any) => ({
            ...a,
            thumbnailUrl: a.thumbnail || a.thumbnailUrl,
            publishedAt: a.published_at || a.publishedAt,
        }));
        return {
            articles: mappedArticles,
            total: mappedArticles.length,
            page: page,
            currentPageSize: mappedArticles.length
        };
    }
    // Fallback if it matches NewsArticles
    if (response && response.articles) {
        response.articles = response.articles.map((a: any) => ({
            ...a,
            thumbnailUrl: a.thumbnail || a.thumbnailUrl,
            publishedAt: a.published_at || a.publishedAt,
        }));
    }
    return response as NewsArticles;
};

export const getNewsArticleDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<NewsArticle | null> => {
    const url = generatePath(API.NEWS_DETAIL, { id: params.id });
    const response = await request<any>("GET", url, {}, withOrgHeader(params.organizationId));
    if (!response) return null;
    return {
        ...response,
        thumbnailUrl: response.thumbnail || response.thumbnailUrl,
        publishedAt: response.published_at || response.publishedAt,
    } as NewsArticle;
};

export const getNewsComments = async (params: {
    id: string;
    organizationId?: string;
}): Promise<NewsComment[]> => {
    const url = generatePath(API.NEWS_COMMENTS, { id: params.id });
    return request<NewsComment[]>(
        "GET",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
};

export const getNewsCategories = async (
    params: { organizationId?: string } = {},
): Promise<NewsCategory[]> =>
    request<NewsCategory[]>(
        "GET",
        API.NEWS_CATEGORIES_API,
        {},
        withOrgHeader(params.organizationId),
    );

export const postNewsComment = async (params: {
    id: string;
    content: string;
    authorName?: string;
    organizationId?: string;
}): Promise<NewsComment | null> => {
    const url = generatePath(API.NEWS_COMMENTS, { id: params.id });
    return request<NewsComment>(
        "POST",
        url,
        { content: params.content, authorName: params.authorName },
        withOrgHeader(params.organizationId),
    );
};
