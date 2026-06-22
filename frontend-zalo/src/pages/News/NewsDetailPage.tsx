import React, { useEffect, useState } from "react";
import { Box, Button, Text, useNavigate, useParams, useSnackbar } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { EmptyState, SectionCard, TextArea } from "@components";
import { useStore } from "@store";
import { openWebView } from "@service/zalo";

const LoadingBlock = styled.div`
    ${tw`bg-ng_10 rounded-lg`}
    height: 260px;
`;

const CategoryChip = styled.span`
    ${tw`text-[11px] font-medium rounded px-2 py-0.5 bg-primary_50 text-main`}
`;

const Cover = styled.img`
    ${tw`w-full rounded-lg mb-3`}
    max-height: 220px;
    object-fit: cover;
`;

const ArticleBody = styled.div`
    ${tw`text-text_1 mt-3`}
    font-size: 14px;
    line-height: 22px;
    word-break: break-word;
    img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: 6px 0;
    }
    h3 {
        ${tw`font-semibold text-text_1`}
        font-size: 16px;
        margin: 10px 0 4px;
    }
    a {
        ${tw`text-main`}
    }
    ul,
    ol {
        padding-left: 20px;
        margin: 6px 0;
    }
    p {
        margin: 6px 0;
    }
`;

const CommentRow = styled.div`
    ${tw`py-3 border-b border-divider_01`}
    &:last-child {
        border-bottom: none;
    }
`;

const Avatar = styled.div`
    ${tw`bg-primary_50 text-main rounded-full flex items-center justify-center font-semibold flex-shrink-0`}
    width: 32px;
    height: 32px;
    font-size: 13px;
`;

const viDate = (value?: string) =>
    value ? value.split("-").reverse().join("/") : "—";

const initial = (name: string) =>
    (name || "?").trim().charAt(0).toUpperCase();

// Nội dung soạn từ Admin có thể là HTML (editor) hoặc văn bản thuần (xuống dòng).
const toHtml = (raw?: string) => {
    const s = raw || "";
    return /<[a-z][\s\S]*>/i.test(s) ? s : s.replace(/\n/g, "<br/>");
};

const NewsDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { openSnackbar } = useSnackbar();

    const [
        article,
        loading,
        getDetail,
        comments,
        gettingComments,
        getComments,
        postComment,
        posting,
        user,
    ] = useStore(state => [
        state.newsArticleDetail,
        state.gettingNewsDetail,
        state.getNewsArticleDetail,
        state.newsComments,
        state.gettingNewsComments,
        state.getNewsComments,
        state.postNewsComment,
        state.postingComment,
        state.user,
    ]);

    const [text, setText] = useState("");

    useEffect(() => {
        if (id) {
            getDetail(id);
            getComments(id);
        }
    }, [id]);

    const onSend = async () => {
        if (!id) return;
        if (!text.trim()) {
            openSnackbar({ type: "warning", text: "Vui lòng nhập nội dung" });
            return;
        }
        const ok = await postComment(id, text.trim(), user?.name);
        if (ok) {
            setText("");
            openSnackbar({ type: "success", text: "Đã gửi bình luận" });
        } else {
            openSnackbar({ type: "error", text: "Gửi bình luận thất bại" });
        }
    };

    if (loading) {
        return (
            <PageLayout title="Tin tức" id="news-detail-loading">
                <Box p={4}>
                    <LoadingBlock />
                </Box>
            </PageLayout>
        );
    }

    if (!article) {
        return (
            <PageLayout title="Tin tức" id="news-detail-empty">
                <EmptyState
                    title="Không tìm thấy tin"
                    actionLabel="Quay lại"
                    onAction={() => navigate(-1)}
                />
            </PageLayout>
        );
    }

    const list = comments || [];

    return (
        <PageLayout title="Tin tức" id="news-detail-page">
            <Box p={4} tw="bg-ui_bg mb-2">
                {article.thumbnailUrl && (
                    <Cover src={article.thumbnailUrl} alt={article.title} />
                )}
                {article.category && (
                    <CategoryChip>{article.category}</CategoryChip>
                )}
                <Text.Title size="small" tw="text-text_1 mt-2">
                    {article.title}
                </Text.Title>
                <Text size="xxSmall" tw="text-text_2 mt-1">
                    {viDate(article.publishedAt)}
                    {article.author ? ` · ${article.author}` : ""}
                    {article.source ? ` · Nguồn: ${article.source}` : ""}
                    {typeof article.viewCount === "number"
                        ? ` · ${article.viewCount} lượt xem`
                        : ""}
                </Text>
                <ArticleBody
                    dangerouslySetInnerHTML={{ __html: toHtml(article.content) }}
                />
                {article.sourceUrl && (
                    <Text
                        size="small"
                        tw="text-main mt-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => openWebView(article.sourceUrl as string)}
                    >
                        → Xem bài gốc
                    </Text>
                )}
            </Box>

            <Box px={4} style={{ paddingBottom: article.allowComment ? 96 : 24 }}>
                <SectionCard title={`Bình luận (${list.length})`}>
                    {gettingComments && (
                        <Text size="small" tw="text-text_2">
                            Đang tải bình luận…
                        </Text>
                    )}
                    {!gettingComments && list.length === 0 && (
                        <Text size="small" tw="text-text_2">
                            Chưa có bình luận
                        </Text>
                    )}
                    {list.map(c => (
                        <CommentRow key={c.id}>
                            <Box tw="flex flex-row">
                                <Avatar>{initial(c.authorName)}</Avatar>
                                <Box tw="flex-1 ml-3">
                                    <Box tw="flex flex-row items-center justify-between">
                                        <Text size="small" tw="text-text_1 font-medium">
                                            {c.authorName}
                                        </Text>
                                        <Text size="xxSmall" tw="text-text_3">
                                            {viDate(c.createdAt)}
                                        </Text>
                                    </Box>
                                    <Text size="small" tw="text-text_1 mt-0.5">
                                        {c.content}
                                    </Text>
                                </Box>
                            </Box>
                        </CommentRow>
                    ))}
                    {article.allowComment === false && (
                        <Text size="xxSmall" tw="text-text_3 mt-2">
                            Bài viết này không mở bình luận.
                        </Text>
                    )}
                </SectionCard>
            </Box>

            {article.allowComment !== false && (
                <Box
                    tw="fixed left-0 right-0 px-4 bg-ui_bg pt-3 border-t border-border flex flex-row items-end gap-2"
                    style={{
                        bottom: 0,
                        paddingBottom:
                            "calc(var(--zaui-safe-area-inset-bottom, 0px) + 12px)",
                    }}
                >
                    <Box tw="flex-1">
                        <TextArea
                            placeholder="Viết bình luận…"
                            value={text}
                            onChange={e => setText(e.target.value)}
                        />
                    </Box>
                    <Button size="small" loading={posting} onClick={onSend}>
                        Gửi
                    </Button>
                </Box>
            )}
        </PageLayout>
    );
};

export default NewsDetailPage;
