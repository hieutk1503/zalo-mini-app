import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Select,
    Text,
    useNavigate,
    useParams,
    useSnackbar,
} from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { EmptyState, SectionCard, StatusBadge, TextArea } from "@components";
import { useStore } from "@store";
import {
    FORWARD_UNITS,
    REFLECTION_STATUS_LABEL,
} from "@constants/reflection";
import { ReflectionLogAction } from "@dts";
import { maskPhoneNumber } from "@utils/string";

const { Option } = Select;

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

const SuccessButton = styled(Button)`
    && {
        ${tw`bg-success text-white`}
    }
`;

const ForwardButton = styled(Button)`
    && {
        ${tw`bg-forwarded text-white`}
    }
`;

const TimelineItem = styled.div`
    ${tw`pl-4 pb-4 border-l-2 border-ng_20 relative`}
    &:last-child {
        ${tw`pb-0`}
    }
    &:before {
        content: "";
        position: absolute;
        left: -5px;
        top: 2px;
        width: 8px;
        height: 8px;
        border-radius: 999px;
        ${tw`bg-main`}
    }
`;

const LOG_LABEL: Record<ReflectionLogAction, string> = {
    create: "Tạo phản ánh",
    receive: "Tiếp nhận",
    forward: "Chuyển tiếp",
    complete: "Hoàn thành",
    reject: "Từ chối",
};

const viDate = (value?: string) =>
    value ? value.split("-").reverse().join("/") : "—";

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

const ReflectionDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { openSnackbar } = useSnackbar();

    const [
        reflection,
        loading,
        getReflectionDetail,
        receiveReflection,
        forwardReflection,
        completeReflection,
        processing,
    ] = useStore(state => [
        state.reflectionDetail,
        state.gettingReflectionDetail,
        state.getReflectionDetail,
        state.receiveReflection,
        state.forwardReflection,
        state.completeReflection,
        state.processingReflection,
    ]);

    const [mode, setMode] = useState<"" | "forward" | "complete">("");
    const [unit, setUnit] = useState<string | undefined>();
    const [note, setNote] = useState("");

    useEffect(() => {
        if (id) {
            getReflectionDetail(id);
        }
    }, [id]);

    const resetAction = () => {
        setMode("");
        setUnit(undefined);
        setNote("");
    };

    const notify = (ok: boolean, okText: string) =>
        openSnackbar({
            type: ok ? "success" : "error",
            text: ok ? okText : "Thao tác thất bại, vui lòng thử lại",
        });

    const onReceive = async () => {
        if (!id) return;
        const ok = await receiveReflection(id);
        notify(ok, "Đã tiếp nhận phản ánh");
    };

    const onForward = async () => {
        if (!id) return;
        if (!unit) {
            openSnackbar({ type: "warning", text: "Vui lòng chọn đơn vị chuyển" });
            return;
        }
        const ok = await forwardReflection(id, unit, note.trim() || undefined);
        notify(ok, "Đã chuyển tiếp phản ánh");
        if (ok) resetAction();
    };

    const onComplete = async () => {
        if (!id) return;
        if (!note.trim()) {
            openSnackbar({ type: "warning", text: "Vui lòng nhập nội dung xử lý" });
            return;
        }
        const ok = await completeReflection(id, note.trim());
        notify(ok, "Đã hoàn thành xử lý");
        if (ok) resetAction();
    };

    if (loading) {
        return (
            <PageLayout title="Chi tiết phản ánh" id="reflection-detail-loading">
                <Box p={4}>
                    <LoadingBlock />
                </Box>
            </PageLayout>
        );
    }

    if (!reflection) {
        return (
            <PageLayout title="Chi tiết phản ánh" id="reflection-detail-empty">
                <EmptyState
                    title="Không tìm thấy phản ánh"
                    actionLabel="Quay lại"
                    onAction={() => navigate(-1)}
                />
            </PageLayout>
        );
    }

    const { status } = reflection;
    const canReceive = status === "pending";
    const canForward = status === "pending" || status === "processing";
    const canComplete =
        status === "pending" ||
        status === "processing" ||
        status === "forwarded";
    const hasActions = canReceive || canForward || canComplete;

    return (
        <PageLayout title="Chi tiết phản ánh" id="reflection-detail-page">
            <Box p={4} tw="bg-ui_bg mb-2">
                <Box tw="flex flex-row items-start justify-between">
                    <Box tw="flex-1 pr-2">
                        <Text size="small" tw="text-main font-medium">
                            {reflection.code}
                        </Text>
                        <Text.Title size="small" tw="text-text_1">
                            {reflection.title}
                        </Text.Title>
                    </Box>
                    <StatusBadge
                        status={status}
                        label={REFLECTION_STATUS_LABEL[status]}
                    />
                </Box>
            </Box>

            <Box px={4} style={{ paddingBottom: 24 }}>
                <SectionCard title="Thông tin phản ánh">
                    <InfoRow label="Loại" value={reflection.typeName} />
                    <InfoRow label="Người gửi" value={reflection.senderName} />
                    <InfoRow
                        label="Số điện thoại"
                        value={maskPhoneNumber(reflection.phone)}
                    />
                    <InfoRow
                        label="Tổ dân phố"
                        value={reflection.neighborhoodGroup}
                    />
                    <InfoRow label="Địa điểm" value={reflection.location} />
                    <InfoRow
                        label="Đơn vị xử lý"
                        value={reflection.handlingUnit}
                    />
                </SectionCard>

                <Box mt={3}>
                    <SectionCard title="Nội dung">
                        <Text size="small" tw="text-text_1">
                            {reflection.content}
                        </Text>
                    </SectionCard>
                </Box>

                {!!reflection.logs?.length && (
                    <Box mt={3}>
                        <SectionCard title="Lịch sử xử lý">
                            {reflection.logs.map(log => (
                                <TimelineItem key={log.id}>
                                    <Text size="small" tw="text-text_1 font-medium">
                                        {LOG_LABEL[log.action]}
                                        {log.toUnit ? ` → ${log.toUnit}` : ""}
                                    </Text>
                                    {log.note && (
                                        <Text size="small" tw="text-text_2 mt-0.5">
                                            {log.note}
                                        </Text>
                                    )}
                                    <Text size="xxSmall" tw="text-text_3 mt-0.5">
                                        {log.byName || ""} · {viDate(log.at)}
                                    </Text>
                                </TimelineItem>
                            ))}
                        </SectionCard>
                    </Box>
                )}

                {hasActions && (
                    <Box mt={4}>
                        {mode === "forward" && (
                            <Box mb={3}>
                                <Select
                                    label="Đơn vị chuyển tiếp *"
                                    placeholder="Chọn đơn vị"
                                    value={unit}
                                    onChange={v => setUnit(v as string)}
                                >
                                    {FORWARD_UNITS.map(u => (
                                        <Option key={u} value={u} title={u} />
                                    ))}
                                </Select>
                                <Box mt={3}>
                                    <TextArea
                                        label="Ghi chú"
                                        placeholder="Nội dung chuyển tiếp (nếu có)"
                                        value={note}
                                        onChange={e => setNote(e.target.value)}
                                    />
                                </Box>
                            </Box>
                        )}
                        {mode === "complete" && (
                            <Box mb={3}>
                                <TextArea
                                    label="Nội dung xử lý *"
                                    placeholder="Mô tả kết quả xử lý"
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                />
                            </Box>
                        )}

                        {mode === "" ? (
                            <Box tw="flex flex-row flex-wrap gap-3">
                                {canReceive && (
                                    <Button
                                        tw="flex-1"
                                        loading={processing}
                                        onClick={onReceive}
                                    >
                                        Tiếp nhận
                                    </Button>
                                )}
                                {canForward && (
                                    <ForwardButton
                                        tw="flex-1"
                                        onClick={() => setMode("forward")}
                                    >
                                        Chuyển tiếp
                                    </ForwardButton>
                                )}
                                {canComplete && (
                                    <SuccessButton
                                        tw="flex-1"
                                        onClick={() => setMode("complete")}
                                    >
                                        Hoàn thành
                                    </SuccessButton>
                                )}
                            </Box>
                        ) : (
                            <Box tw="flex flex-row gap-3">
                                <Button
                                    variant="secondary"
                                    tw="flex-1"
                                    onClick={resetAction}
                                >
                                    Hủy
                                </Button>
                                {mode === "forward" ? (
                                    <ForwardButton
                                        tw="flex-1"
                                        loading={processing}
                                        onClick={onForward}
                                    >
                                        Xác nhận chuyển
                                    </ForwardButton>
                                ) : (
                                    <SuccessButton
                                        tw="flex-1"
                                        loading={processing}
                                        onClick={onComplete}
                                    >
                                        Xác nhận hoàn thành
                                    </SuccessButton>
                                )}
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </PageLayout>
    );
};

export default ReflectionDetailPage;
