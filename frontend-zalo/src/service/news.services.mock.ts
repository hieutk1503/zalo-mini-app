/**
 * Mock service cho Tin tức nội bộ (chi tiết + bình luận).
 * In-memory để bình luận mới tồn tại trong phiên.
 * Nguồn dữ liệu GIẢ: @mock/news.json.
 */
import { NewsArticle, NewsArticles, NewsComment, NewsCategory } from "@dts";
import db from "@mock/news.json";
import { matchKeyword } from "@utils/string";
import { NEWS_CATEGORIES } from "@constants/common";

const delay = <T>(data: T, ms = 300): Promise<T> =>
    new Promise(resolve => {
        setTimeout(() => resolve(data), ms);
    });

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const articles: NewsArticle[] = clone(db.articles) as NewsArticle[];
const comments: NewsComment[] = clone(db.comments) as NewsComment[];

let seq = 5000;
const newId = (p: string) => {
    seq += 1;
    return `${p}-${Date.now()}-${seq}`;
};
const today = () => new Date().toISOString().slice(0, 10);

const paginate = <T>(list: T[], page: number, limit: number) => ({
    total: list.length,
    page,
    currentPageSize: limit,
    slice: list.slice(page * limit, page * limit + limit),
});

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
    const { page = 0, limit = 10, keyword = "", category } = params;
    let list = [...articles];
    if (category) {
        list = list.filter(a => a.category === category);
    }
    if (keyword) {
        list = list.filter(a =>
            matchKeyword(keyword, [a.title, a.summary, a.category]),
        );
    }
    const { slice, ...meta } = paginate(list, page, limit);
    return delay({ articles: slice, ...meta });
};

export const getNewsArticleDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<NewsArticle | null> =>
    delay(clone(articles.find(a => a.id === params.id) || null));

export const getNewsComments = async (params: {
    id: string;
    organizationId?: string;
}): Promise<NewsComment[]> =>
    delay(clone(comments.filter(c => c.articleId === params.id && !c.hidden)));

export const getNewsCategories = async (): Promise<NewsCategory[]> =>
    delay(
        NEWS_CATEGORIES.map((name, i) => ({
            id: `ncat-${i + 1}`,
            name,
            order: i + 1,
            enabled: true,
        })),
    );

export const postNewsComment = async (params: {
    id: string;
    content: string;
    authorName?: string;
    organizationId?: string;
}): Promise<NewsComment | null> => {
    const article = articles.find(a => a.id === params.id);
    if (!article || article.allowComment === false) {
        return delay(null);
    }
    const comment: NewsComment = {
        id: newId("cm"),
        articleId: params.id,
        authorName: params.authorName || "Người dân",
        content: params.content,
        createdAt: today(),
    };
    comments.push(comment);
    article.commentCount = (article.commentCount || 0) + 1;
    return delay(clone(comment), 300);
};
