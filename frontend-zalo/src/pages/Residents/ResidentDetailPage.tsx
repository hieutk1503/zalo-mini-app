import React, { useEffect } from "react";
import { Box, Button, Text, useNavigate, useParams, useSnackbar } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { EmptyState, SectionCard, StatusBadge } from "@components/common";
import { useStore } from "@store";
import { ROUTES } from "@constants/common";
import { genderLabel, residenceTypeLabel } from "@constants/resident-group";
import { maskCitizenId, maskPhoneNumber } from "@utils/string";

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

const ResidentDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { openSnackbar } = useSnackbar();

    const [
        resident,
        loading,
        getResidentDetail,
        submitResidentApproval,
    ] = useStore(state => [
        state.residentDetail,
        state.gettingResidentDetail,
        state.getResidentDetail,
        state.submitResidentApproval,
    ]);

    useEffect(() => {
        if (id) {
            getResidentDetail(id);
        }
    }, [id]);

    const onSubmitApproval = async () => {
        if (!id) {
            return;
        }
        const ok = await submitResidentApproval(id);
        openSnackbar({
            type: ok ? "success" : "error",
            text: ok
                ? "Đã gửi thông tin chờ duyệt"
                : "Gửi duyệt thất bại, vui lòng thử lại",
        });
    };

    if (loading) {
        return (
            <PageLayout title="Chi tiết cư dân" id="resident-detail-loading">
                <Box p={4}>
                    <LoadingBlock />
                </Box>
            </PageLayout>
        );
    }

    if (!resident) {
        return (
            <PageLayout title="Chi tiết cư dân" id="resident-detail-empty">
                <EmptyState
                    title="Không tìm thấy cư dân"
                    actionLabel="Quay lại"
                    onAction={() => navigate(-1)}
                />
            </PageLayout>
        );
    }

    const canSubmit =
        resident.status === "draft" || resident.status === "rejected";

    return (
        <PageLayout title="Chi tiết cư dân" id="resident-detail-page">
            <Box p={4} tw="bg-ui_bg mb-2">
                <Box tw="flex flex-row items-start justify-between">
                    <Text.Title size="small" tw="text-text_1 flex-1 pr-2">
                        {resident.fullName}
                    </Text.Title>
                    <StatusBadge status={resident.status} />
                </Box>
                {resident.status === "rejected" && resident.rejectReason && (
                    <Box
                        mt={3}
                        p={3}
                        tw="rounded-lg"
                        style={{ backgroundColor: "#FEECEC" }}
                    >
                        <Text size="small" tw="text-danger">
                            Lý do từ chối: {resident.rejectReason}
                        </Text>
                    </Box>
                )}
            </Box>

            <Box px={4} pb={4}>
                <SectionCard title="Thông tin chung">
                    <InfoRow
                        label="CCCD"
                        value={maskCitizenId(resident.citizenId)}
                    />
                    <InfoRow label="Ngày sinh" value={viDate(resident.dob)} />
                    <InfoRow
                        label="Giới tính"
                        value={genderLabel(resident.gender)}
                    />
                    <InfoRow
                        label="Số điện thoại"
                        value={maskPhoneNumber(resident.phone)}
                    />
                    <InfoRow label="Email" value={resident.email} />
                    <InfoRow label="Dân tộc" value={resident.ethnicity} />
                    <InfoRow label="Tôn giáo" value={resident.religion} />
                    <InfoRow
                        label="Quốc tịch"
                        value={resident.nationality}
                    />
                </SectionCard>

                <Box mt={3}>
                    <SectionCard title="Cư trú & hộ dân">
                        <InfoRow
                            label="Loại cư trú"
                            value={residenceTypeLabel(resident.residenceType)}
                        />
                        <InfoRow
                            label="Địa chỉ thường trú"
                            value={resident.permanentAddress}
                        />
                        <InfoRow
                            label="Địa chỉ hiện tại"
                            value={resident.currentAddress}
                        />
                        <InfoRow
                            label="Tổ dân phố"
                            value={resident.neighborhoodGroup}
                        />
                        <InfoRow label="Hộ dân" value={resident.householdCode} />
                        <InfoRow
                            label="Quan hệ với chủ hộ"
                            value={resident.relationToHead}
                        />
                    </SectionCard>
                </Box>

                {!!resident.unionInfos?.length && (
                    <Box mt={3}>
                        <SectionCard title="Đoàn thể">
                            {resident.unionInfos.map(u => (
                                <Row key={u.id}>
                                    <Text size="small" tw="text-text_1 flex-1">
                                        {u.organization}
                                        {u.role ? ` · ${u.role}` : ""}
                                    </Text>
                                    <Text size="xxSmall" tw="text-text_2">
                                        {viDate(u.joinDate)}
                                    </Text>
                                </Row>
                            ))}
                        </SectionCard>
                    </Box>
                )}

                {!!resident.rewards?.length && (
                    <Box mt={3}>
                        <SectionCard title="Khen thưởng">
                            {resident.rewards.map(rw => (
                                <Row key={rw.id}>
                                    <Text size="small" tw="text-text_1 flex-1 pr-2">
                                        {rw.title}
                                        {rw.level ? ` · ${rw.level}` : ""}
                                    </Text>
                                    <Text size="xxSmall" tw="text-text_2">
                                        {viDate(rw.decisionDate)}
                                    </Text>
                                </Row>
                            ))}
                        </SectionCard>
                    </Box>
                )}

                <Box mt={3} tw="flex flex-row gap-3">
                    <Button
                        variant="secondary"
                        onClick={() =>
                            navigate(`${ROUTES.RESIDENTS}/${resident.id}/edit`, {
                                animate: true,
                                direction: "forward",
                            })
                        }
                        tw="flex-1"
                    >
                        Sửa thông tin
                    </Button>
                    {canSubmit && (
                        <Button onClick={onSubmitApproval} tw="flex-1">
                            Gửi xác nhận
                        </Button>
                    )}
                </Box>

                {/* TODO: tab Kỷ luật / Tiền án tiền sự — cần xác nhận quyền hiển thị theo vai trò. */}
            </Box>
        </PageLayout>
    );
};

export default ResidentDetailPage;
