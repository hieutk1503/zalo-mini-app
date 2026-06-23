import React, { useEffect, useState } from "react";
import { Box, Button, Text, useNavigate, useParams, useSnackbar } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { EmptyState, SectionCard, StatusBadge, TextArea } from "@components";
import { useStore } from "@store";
import { ROUTES } from "@constants/common";

const Row = styled.div`
    ${tw`flex flex-row justify-between items-start py-2 border-b border-divider_01`}
    &:last-child {
        border-bottom: none;
    }
`;

const LoadingBlock = styled.div`
    ${tw`bg-ng_10 rounded-lg`}
    height: 200px;
`;

const SuccessButton = styled(Button)`
    && {
        ${tw`bg-success text-white`}
    }
`;

const DangerButton = styled(Button)`
    && {
        ${tw`bg-danger text-white`}
    }
`;

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

const ApprovalDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { openSnackbar } = useSnackbar();

    const [
        request,
        loading,
        getApprovalRequestDetail,
        approveRequest,
        rejectRequest,
        processing,
    ] = useStore(state => [
        state.approvalRequestDetail,
        state.gettingApprovalRequestDetail,
        state.getApprovalRequestDetail,
        state.approveRequest,
        state.rejectRequest,
        state.processingApproval,
    ]);

    const [rejecting, setRejecting] = useState(false);
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (id) {
            getApprovalRequestDetail(id);
        }
    }, [id]);

    const onApprove = async () => {
        if (!id) return;
        const ok = await approveRequest(id);
        openSnackbar({
            type: ok ? "success" : "error",
            text: ok ? "Đã phê duyệt yêu cầu" : "Phê duyệt thất bại",
        });
        if (ok) {
            navigate(-1);
        }
    };

    const onReject = async () => {
        if (!id) return;
        if (!reason.trim()) {
            openSnackbar({
                type: "warning",
                text: "Vui lòng nhập lý do từ chối",
            });
            return;
        }
        const ok = await rejectRequest(id, reason.trim());
        openSnackbar({
            type: ok ? "success" : "error",
            text: ok ? "Đã từ chối yêu cầu" : "Từ chối thất bại",
        });
        if (ok) {
            navigate(-1);
        }
    };

    if (loading) {
        return (
            <PageLayout title="Chi tiết duyệt" id="approval-detail-loading">
                <Box p={4}>
                    <LoadingBlock />
                </Box>
            </PageLayout>
        );
    }

    if (!request) {
        return (
            <PageLayout title="Chi tiết duyệt" id="approval-detail-empty">
                <EmptyState
                    title="Không tìm thấy yêu cầu"
                    actionLabel="Quay lại"
                    onAction={() => navigate(-1)}
                />
            </PageLayout>
        );
    }

    const targetRoute =
        request.targetType === "resident"
            ? `${ROUTES.RESIDENTS}/${request.targetId}`
            : `${ROUTES.HOUSEHOLDS}/${request.targetId}`;

    const isPending = request.status === "pending";

    return (
        <PageLayout title="Chi tiết duyệt" id="approval-detail-page">
            <Box p={4} tw="bg-ui_bg mb-2">
                <Box tw="flex flex-row items-start justify-between">
                    <Text.Title size="small" tw="text-text_1 flex-1 pr-2">
                        {request.targetName}
                    </Text.Title>
                    <StatusBadge status={request.status} />
                </Box>
                <Text size="small" tw="text-text_2 mt-1">
                    {request.targetType === "resident"
                        ? "Yêu cầu về cư dân"
                        : "Yêu cầu về hộ dân"}
                </Text>
            </Box>

            <Box px={4} pb={4}>
                <SectionCard title="Thông tin yêu cầu">
                    <InfoRow label="Người gửi" value={request.requesterName} />
                    <InfoRow
                        label="Tổ dân phố"
                        value={request.neighborhoodGroup}
                    />
                    <InfoRow label="Nội dung" value={request.summary} />
                    <InfoRow
                        label="Ngày gửi"
                        value={viDate(request.submittedAt)}
                    />
                    {request.status === "rejected" && request.rejectReason && (
                        <InfoRow
                            label="Lý do từ chối"
                            value={request.rejectReason}
                        />
                    )}
                </SectionCard>

                <Box mt={3}>
                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={() =>
                            navigate(targetRoute, {
                                animate: true,
                                direction: "forward",
                            })
                        }
                    >
                        Xem chi tiết{" "}
                        {request.targetType === "resident"
                            ? "cư dân"
                            : "hộ dân"}
                    </Button>
                </Box>

                {isPending && (
                    <Box mt={4}>
                        {rejecting && (
                            <Box mb={3}>
                                <TextArea
                                    label="Lý do từ chối *"
                                    placeholder="Nhập lý do từ chối"
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                />
                            </Box>
                        )}
                        <Box tw="flex flex-row gap-3">
                            {!rejecting ? (
                                <>
                                    <DangerButton
                                        tw="flex-1"
                                        onClick={() => setRejecting(true)}
                                    >
                                        Từ chối
                                    </DangerButton>
                                    <SuccessButton
                                        tw="flex-1"
                                        loading={processing}
                                        onClick={onApprove}
                                    >
                                        Phê duyệt
                                    </SuccessButton>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="secondary"
                                        tw="flex-1"
                                        onClick={() => {
                                            setRejecting(false);
                                            setReason("");
                                        }}
                                    >
                                        Hủy
                                    </Button>
                                    <DangerButton
                                        tw="flex-1"
                                        loading={processing}
                                        onClick={onReject}
                                    >
                                        Xác nhận từ chối
                                    </DangerButton>
                                </>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>
        </PageLayout>
    );
};

export default ApprovalDetailPage;
