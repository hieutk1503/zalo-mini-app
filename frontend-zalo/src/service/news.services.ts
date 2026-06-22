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
    return request<NewsArticles>(
        "GET",
        API.NEWS,
        { page, pageSize: limit, ...rest },
        withOrgHeader(organizationId),
    );
};

export const getNewsArticleDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<NewsArticle | null> => {
    const url = generatePath(API.NEWS_DETAIL, { id: params.id });
    return request<NewsArticle>("GET", url, {}, withOrgHeader(params.organizationId));
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
