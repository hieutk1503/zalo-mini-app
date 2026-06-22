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
import { useForm } from "react-hook-form";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { Input } from "@components";
import { EmptyState, MetaBadge, SectionCard } from "@components/common";
import { useStore } from "@store";
import { GROUP_STATUS_META } from "@constants/neighborhood";

const Row = styled.div`
    ${tw`flex flex-row justify-between items-center py-3 border-b border-divider_01`}
    &:last-child {
        border-bottom: none;
    }
`;

const LoadingBlock = styled.div`
    ${tw`bg-ng_10 rounded-lg`}
    height: 200px;
`;

const RemoveBtn = styled.button`
    ${tw`text-danger flex items-center`}
`;

const CommunityGroupDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { openSnackbar } = useSnackbar();

    const [
        group,
        loading,
        getCommunityGroupDetail,
        addMember,
        removeMember,
        saving,
    ] = useStore(state => [
        state.groupDetail,
        state.gettingGroupDetail,
        state.getCommunityGroupDetail,
        state.addCommunityGroupMember,
        state.removeCommunityGroupMember,
        state.savingGroup,
    ]);

    const [showAdd, setShowAdd] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    useEffect(() => {
        if (id) {
            getCommunityGroupDetail(id);
        }
    }, [id]);

    const onAdd = handleSubmit(async data => {
        if (!id) return;
        const updated = await addMember(id, {
            name: data.name,
            role: data.role || undefined,
        });
        if (updated) {
            openSnackbar({ type: "success", text: "Đã thêm thành viên" });
            reset({ name: "", role: "" });
            setShowAdd(false);
        } else {
            openSnackbar({ type: "error", text: "Thêm thành viên thất bại" });
        }
    });

    const onRemove = async (memberId: string) => {
        if (!id) return;
        await removeMember(id, memberId);
    };

    if (loading) {
        return (
            <PageLayout title="Chi tiết nhóm" id="group-loading">
                <Box p={4}>
                    <LoadingBlock />
                </Box>
            </PageLayout>
        );
    }

    if (!group) {
        return (
            <PageLayout title="Chi tiết nhóm" id="group-empty">
                <EmptyState
                    title="Không tìm thấy nhóm"
                    actionLabel="Quay lại"
                    onAction={() => navigate(-1)}
                />
            </PageLayout>
        );
    }

    const members = group.members || [];

    return (
        <PageLayout title="Chi tiết nhóm" id="group-detail-page">
            <Box p={4} tw="bg-ui_bg mb-2">
                <Box tw="flex flex-row items-start justify-between">
                    <Text.Title size="small" tw="text-text_1 flex-1 pr-2">
                        {group.name}
                    </Text.Title>
                    <MetaBadge meta={GROUP_STATUS_META[group.status]} />
                </Box>
                {group.topic && (
                    <Text size="small" tw="text-text_2 mt-1">
                        Chủ đề: {group.topic}
                    </Text>
                )}
                {group.description && (
                    <Text size="small" tw="text-text_2 mt-1">
                        {group.description}
                    </Text>
                )}
            </Box>

            <Box px={4} style={{ paddingBottom: 24 }}>
                <SectionCard
                    title={`Thành viên (${members.length})`}
                    actionLabel={showAdd ? "Đóng" : "Thêm thành viên"}
                    onAction={() => setShowAdd(s => !s)}
                >
                    {members.length === 0 && !showAdd && (
                        <Text size="small" tw="text-text_2">
                            Chưa có thành viên
                        </Text>
                    )}
                    {members.map(m => (
                        <Row key={m.id}>
                            <Box tw="flex-1 pr-2">
                                <Text size="small" tw="text-text_1 font-medium">
                                    {m.name}
                                </Text>
                                {m.role && (
                                    <Text size="xxSmall" tw="text-text_2">
                                        {m.role}
                                    </Text>
                                )}
                            </Box>
                            <RemoveBtn
                                type="button"
                                onClick={() => onRemove(m.id)}
                            >
                                <Icon icon="zi-delete" size={18} />
                            </RemoveBtn>
                        </Row>
                    ))}

                    {showAdd && (
                        <Box mt={3} pt={3} tw="border-t border-border">
                            <Input
                                label="Họ và tên *"
                                placeholder="Tên thành viên"
                                status={errors?.name ? "error" : "default"}
                                errorText={
                                    errors?.name
                                        ? "Họ và tên không được để trống"
                                        : ""
                                }
                                {...register("name", { required: true })}
                            />
                            <Box mt={3}>
                                <Input
                                    label="Vai trò"
                                    placeholder="VD: Nhóm trưởng"
                                    {...register("role")}
                                />
                            </Box>
                            <Button
                                fullWidth
                                tw="mt-4"
                                loading={saving}
                                onClick={() => onAdd()}
                            >
                                Lưu thành viên
                            </Button>
                        </Box>
                    )}
                </SectionCard>

                {/* TODO: chọn thành viên từ danh sách cư dân đã duyệt (vai trò tổ trưởng). */}
            </Box>
        </PageLayout>
    );
};

export default CommunityGroupDetailPage;
