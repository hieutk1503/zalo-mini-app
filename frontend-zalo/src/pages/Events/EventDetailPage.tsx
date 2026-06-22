import React, { useEffect } from "react";
import { Box, Text, useNavigate, useParams } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { EmptyState } from "@components";
import { useStore } from "@store";
import { openWebView } from "@service/zalo";

const LoadingBlock = styled.div`
    ${tw`bg-ng_10 rounded-lg`}
    height: 220px;
`;

const Cover = styled.img`
    ${tw`w-full rounded-lg mb-3`}
    max-height: 220px;
    object-fit: cover;
`;

const InfoRow = styled.div`
    ${tw`flex flex-row items-center text-text_2`}
    font-size: 13px;
    margin-top: 6px;
    gap: 6px;
`;

const Body = styled.div`
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

// Mô tả soạn từ Admin có thể là HTML (editor) hoặc văn bản thuần.
const toHtml = (raw?: string) => {
    const s = raw || "";
    return /<[a-z][\s\S]*>/i.test(s) ? s : s.replace(/\n/g, "<br/>");
};

const pad2 = (n: number) => String(n).padStart(2, "0");
const fmtRange = (start?: string, end?: string) => {
    if (!start) return "";
    const s = new Date(start);
    if (Number.isNaN(s.getTime())) return "";
    const date = `${pad2(s.getDate())}/${pad2(s.getMonth() + 1)}/${s.getFullYear()}`;
    const st = `${pad2(s.getHours())}:${pad2(s.getMinutes())}`;
    const e = end ? new Date(end) : null;
    const et =
        e && !Number.isNaN(e.getTime())
            ? `${pad2(e.getHours())}:${pad2(e.getMinutes())}`
            : "";
    return et ? `${st} - ${et}, ${date}` : `${st}, ${date}`;
};

const EventDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [event, loading, getDetail] = useStore(state => [
        state.eventDetail,
        state.gettingEventDetail,
        state.getEventDetail,
    ]);

    useEffect(() => {
        if (id) getDetail(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading) {
        return (
            <PageLayout title="Sự kiện" id="event-detail-loading">
                <Box p={4}>
                    <LoadingBlock />
                </Box>
            </PageLayout>
        );
    }

    if (!event) {
        return (
            <PageLayout title="Sự kiện" id="event-detail-empty">
                <EmptyState
                    title="Không tìm thấy sự kiện"
                    actionLabel="Quay lại"
                    onAction={() => navigate(-1)}
                />
            </PageLayout>
        );
    }

    const timeText = fmtRange(event.startTime, event.endTime);

    return (
        <PageLayout title="Sự kiện" id="event-detail-page">
            <Box p={4} tw="bg-ui_bg">
                {event.imageUrl && <Cover src={event.imageUrl} alt={event.title} />}
                <Text.Title size="small" tw="text-text_1">
                    {event.title}
                </Text.Title>
                {timeText && <InfoRow>🕒 {timeText}</InfoRow>}
                {event.location && <InfoRow>📍 {event.location}</InfoRow>}
                <Body dangerouslySetInnerHTML={{ __html: toHtml(event.description) }} />
                {event.link && (
                    <Text
                        size="small"
                        tw="text-main mt-4"
                        style={{ cursor: "pointer" }}
                        onClick={() => openWebView(event.link as string)}
                    >
                        → Xem chi tiết / Đăng ký
                    </Text>
                )}
            </Box>
        </PageLayout>
    );
};

export default EventDetailPage;
