import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Icon,
    Text,
    useNavigate,
    useParams,
    useSnackbar,
} from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { EmptyState, MetaBadge, SectionCard, TextArea } from "@components";
import { useStore } from "@store";
import {
    CONFIRM_STATUS_META,
    MEETING_STATUS_META,
} from "@constants/neighborhood";

const Row = styled.div`
    ${tw`flex flex-row justify-between items-start py-2 border-b border-divider_01`}
    &:last-child {
        border-bottom: none;
    }
`;

const LoadingBlock = styled.div`
    ${tw`bg-ng_10 rounded-lg`}
    height: 220px;
`;

const fmtDateTime = (s?: string) => {
    if (!s) return "—";
    const [d, t] = s.split("T");
    const date = d ? d.split("-").reverse().join("/") : "";
    return t ? `${t} · ${date}` : date;
};

const InfoRow: React.FC<{ label: string; value?: React.ReactNode }> = ({
    label,
    value,
}) => (
    <Row>
        <Text size="small" tw="text-text_2 flex-shrink-0 pr-3">
            {label}
        </Text>
        <Text size="small" tw="text-text_1 text-right font-medium">
            {value || "—"}
        </Text>
    </Row>
);

const MeetingDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { openSnackbar } = useSnackbar();

    const [
        meeting,
        loading,
        getMeetingDetail,
        confirmMeeting,
        declineMeeting,
        processing,
    ] = useStore(state => [
        state.meetingDetail,
        state.gettingMeetingDetail,
        state.getMeetingDetail,
        state.confirmMeeting,
        state.declineMeeting,
        state.processingMeeting,
    ]);

    const [declining, setDeclining] = useState(false);
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (id) {
            getMeetingDetail(id);
        }
    }, [id]);

    const onConfirm = async () => {
        if (!id) return;
        const ok = await confirmMeeting(id);
        openSnackbar({
            type: ok ? "success" : "error",
            text: ok ? "Đã xác nhận tham gia" : "Thao tác thất bại",
        });
    };

    const onDecline = async () => {
        if (!id) return;
        const ok = await declineMeeting(id, reason.trim() || undefined);
        openSnackbar({
            type: ok ? "success" : "error",
            text: ok ? "Đã từ chối tham gia" : "Thao tác thất bại",
        });
        if (ok) {
            setDeclining(false);
            setReason("");
        }
    };

    if (loading) {
        return (
            <PageLayout title="Chi tiết cuộc họp" id="meeting-loading">
                <Box p={4}>
                    <LoadingBlock />
                </Box>
            </PageLayout>
        );
    }

    if (!meeting) {
        return (
            <PageLayout title="Chi tiết cuộc họp" id="meeting-empty">
                <EmptyState
                    title="Không tìm thấy cuộc họp"
                    actionLabel="Quay lại"
                    onAction={() => navigate(-1)}
                />
            </PageLayout>
        );
    }

    const canRsvp = meeting.status === "scheduled";
    const myStatus = meeting.myConfirmStatus || "pending";

    return (
        <PageLayout title="Chi tiết cuộc họp" id="meeting-detail-page">
            <Box p={4} tw="bg-ui_bg mb-2">
                <Box tw="flex flex-row items-start justify-between">
                    <Text.Title size="small" tw="text-text_1 flex-1 pr-2">
                        {meeting.title}
                    </Text.Title>
                    <MetaBadge meta={MEETING_STATUS_META[meeting.status]} />
                </Box>
            </Box>

            <Box px={4} style={{ paddingBottom: 24 }}>
                <SectionCard title="Thông tin cuộc họp">
                    <InfoRow
                        label="Thời gian"
                        value={fmtDateTime(meeting.startTime)}
                    />
                    <InfoRow label="Địa điểm" value={meeting.location} />
                    <InfoRow label="Chủ trì" value={meeting.chairperson} />
                    <InfoRow
                        label="Tổ dân phố"
                        value={meeting.neighborhoodGroup}
                    />
                </SectionCard>

                <Box mt={3}>
                    <SectionCard title="Nội dung">
                        <Text size="small" tw="text-text_1">
                            {meeting.content}
                        </Text>
                    </SectionCard>
                </Box>

                {!!meeting.participants?.length && (
                    <Box mt={3}>
                        <SectionCard
                            title={`Thành phần tham dự (${meeting.participants.length})`}
                        >
                            {meeting.participants.map(p => (
                                <Row key={p.id}>
                                    <Text
                                        size="small"
                                        tw="text-text_1 flex-1 pr-2"
                                    >
                                        {p.name}
                                    </Text>
                                    <MetaBadge
                                        small
                                        meta={
                                            CONFIRM_STATUS_META[p.confirmStatus]
                                        }
                                    />
                                </Row>
                            ))}
                        </SectionCard>
                    </Box>
                )}

                {!!meeting.documents?.length && (
                    <Box mt={3}>
                        <SectionCard title="Tài liệu liên quan">
                            {meeting.documents.map(d => (
                                <Row key={d.id}>
                                    <Box tw="flex flex-row items-center flex-1">
                                        <Icon icon="zi-file" size={16} />
                                        <Text
                                            size="small"
                                            tw="text-text_1 ml-2"
                                        >
                                            {d.name}
                                        </Text>
                                    </Box>
                                </Row>
                            ))}
                        </SectionCard>
                    </Box>
                )}

                {meeting.status === "finished" && meeting.conclusion && (
                    <Box mt={3}>
                        <SectionCard title="Kết luận cuộc họp">
                            <Text size="small" tw="text-text_1">
                                {meeting.conclusion}
                            </Text>
                        </SectionCard>
                    </Box>
                )}

                {canRsvp && (
                    <Box mt={4}>
                        <Box tw="flex flex-row items-center mb-3">
                            <Text size="small" tw="text-text_2 mr-2">
                                Trạng thái của bạn:
                            </Text>
                            <MetaBadge
                                small
                                meta={CONFIRM_STATUS_META[myStatus]}
                            />
                        </Box>

                        {declining ? (
                            <Box>
                                <TextArea
                                    label="Lý do từ chối"
                                    placeholder="Nhập lý do (nếu có)"
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                />
                                <Box tw="flex flex-row gap-3 mt-3">
                                    <Button
                                        variant="secondary"
                                        tw="flex-1"
                                        onClick={() => {
                                            setDeclining(false);
                                            setReason("");
                                        }}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        tw="flex-1"
                                        loading={processing}
                                        onClick={onDecline}
                                    >
                                        Xác nhận từ chối
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Box tw="flex flex-row gap-3">
                                <Button
                                    variant="secondary"
                                    tw="flex-1"
                                    onClick={() => setDeclining(true)}
                                >
                                    Từ chối tham gia
                                </Button>
                                <Button
                                    tw="flex-1"
                                    loading={processing}
                                    onClick={onConfirm}
                                >
                                    Xác nhận tham gia
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}

                {/* TODO: gán/điều chỉnh thành phần tham dự từ danh sách cư dân (vai trò tổ trưởng). */}
            </Box>
        </PageLayout>
    );
};

export default MeetingDetailPage;
