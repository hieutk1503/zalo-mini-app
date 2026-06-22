import React, { useState } from "react";
import { Box, Button, Select, useNavigate, useSnackbar } from "zmp-ui";
import { useForm } from "react-hook-form";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { Input, TextArea } from "@components";
import { SectionCard } from "@components/common";
import { useStore } from "@store";
import { ROUTES } from "@constants/common";
import { GROUP_TOPICS } from "@constants/neighborhood";
import { GroupStatus } from "@dts";

const { Option } = Select;

const STATUS_OPTIONS: { value: GroupStatus; label: string }[] = [
    { value: "active", label: "Đang hoạt động" },
    { value: "inactive", label: "Ngừng" },
];

const CommunityGroupFormPage: React.FC = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();

    const [createCommunityGroup, saving] = useStore(state => [
        state.createCommunityGroup,
        state.savingGroup,
    ]);

    const [topic, setTopic] = useState<string | undefined>();
    const [status, setStatus] = useState<GroupStatus>("active");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    const onSubmit = handleSubmit(async data => {
        const saved = await createCommunityGroup({
            name: data.name,
            description: data.description,
            topic,
            status,
        });
        if (saved) {
            openSnackbar({ type: "success", text: "Đã tạo nhóm cộng đồng" });
            navigate(`${ROUTES.COMMUNITY_GROUPS}/${saved.id}`, {
                animate: true,
                direction: "forward",
            });
        } else {
            openSnackbar({ type: "error", text: "Tạo nhóm thất bại" });
        }
    });

    return (
        <PageLayout title="Tạo nhóm cộng đồng" id="group-form-page">
            <Box px={4} pt={4} style={{ paddingBottom: 110 }}>
                <SectionCard title="Thông tin nhóm">
                    <Input
                        label="Tên nhóm *"
                        placeholder="Nhập tên nhóm cộng đồng"
                        status={errors?.name ? "error" : "default"}
                        errorText={
                            errors?.name ? "Tên nhóm không được để trống" : ""
                        }
                        {...register("name", { required: true })}
                    />
                    <Box mt={4}>
                        <Select
                            label="Chủ đề / loại nhóm"
                            placeholder="Chọn chủ đề"
                            value={topic}
                            onChange={v => setTopic(v as string)}
                        >
                            {GROUP_TOPICS.map(t => (
                                <Option key={t} value={t} title={t} />
                            ))}
                        </Select>
                    </Box>
                    <Box mt={4}>
                        <Select
                            label="Trạng thái"
                            value={status}
                            onChange={v => setStatus(v as GroupStatus)}
                        >
                            {STATUS_OPTIONS.map(o => (
                                <Option
                                    key={o.value}
                                    value={o.value}
                                    title={o.label}
                                />
                            ))}
                        </Select>
                    </Box>
                    <Box mt={4}>
                        <TextArea
                            label="Mô tả"
                            placeholder="Mục đích, hoạt động của nhóm"
                            {...register("description")}
                        />
                    </Box>
                </SectionCard>

                <Box mt={3} px={1}>
                    <Box tw="text-text_2 text-[12px]">
                        Sau khi tạo, thêm thành viên trong màn chi tiết nhóm.
                    </Box>
                </Box>
            </Box>

            <Box
                tw="fixed left-0 right-0 px-4 bg-ui_bg pt-3 border-t border-border"
                style={{
                    bottom: 0,
                    paddingBottom:
                        "calc(var(--zaui-safe-area-inset-bottom, 0px) + 12px)",
                }}
            >
                <Button fullWidth loading={saving} onClick={() => onSubmit()}>
                    Tạo nhóm
                </Button>
            </Box>
        </PageLayout>
    );
};

export default CommunityGroupFormPage;
