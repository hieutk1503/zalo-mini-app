import React, { useState } from "react";
import {
    Box,
    Button,
    Select,
    useNavigate,
    useSnackbar,
} from "zmp-ui";
import { useForm } from "react-hook-form";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { Input, TextArea } from "@components";
import { FileUpload, SectionCard } from "@components/common";
import { useStore } from "@store";
import { ROUTES } from "@constants/common";
import { NEIGHBORHOOD_GROUPS } from "@constants/resident-group";
import { UploadResult } from "@dts";

const { Option } = Select;

const displayToIso = (value?: string) => {
    if (!value) return "";
    const parts = value.split("/");
    if (parts.length !== 3) return "";
    const [d, m, y] = parts;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};

const isValidDate = (v: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(v.trim());
const isValidTime = (v: string) => /^\d{2}:\d{2}$/.test(v.trim());

const MeetingFormPage: React.FC = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();

    const [createMeeting, saving] = useStore(state => [
        state.createMeeting,
        state.savingMeeting,
    ]);

    const [group, setGroup] = useState<string | undefined>();
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [documents, setDocuments] = useState<UploadResult[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    const errText = (field: string, label: string) => {
        if (!errors[field]) return "";
        if (errors[field]?.type === "required")
            return `${label} không được để trống`;
        return `${label} không hợp lệ`;
    };

    const onSubmit = handleSubmit(async data => {
        if (!isValidDate(date) || !isValidTime(time)) {
            openSnackbar({
                type: "warning",
                text: "Vui lòng nhập ngày (dd/mm/yyyy) và giờ (HH:mm) hợp lệ",
            });
            return;
        }
        const startTime = `${displayToIso(date)}T${time.trim()}`;
        const saved = await createMeeting({
            title: data.title,
            content: data.content,
            location: data.location,
            chairperson: data.chairperson,
            note: data.note,
            neighborhoodGroup: group,
            startTime,
            status: "scheduled",
            documents: documents.map((d, i) => ({
                id: `md-${i}`,
                name: d.name,
                url: d.url,
            })),
        });
        if (saved) {
            openSnackbar({ type: "success", text: "Đã tạo cuộc họp" });
            navigate(`${ROUTES.MEETINGS}/${saved.id}`, {
                animate: true,
                direction: "forward",
            });
        } else {
            openSnackbar({ type: "error", text: "Tạo cuộc họp thất bại" });
        }
    });

    return (
        <PageLayout title="Tạo cuộc họp" id="meeting-form-page">
            <Box px={4} pt={4} style={{ paddingBottom: 110 }}>
                <SectionCard title="Thông tin cuộc họp">
                    <Input
                        label="Tên cuộc họp *"
                        placeholder="Nhập tên cuộc họp"
                        status={errors?.title ? "error" : "default"}
                        errorText={errText("title", "Tên cuộc họp")}
                        {...register("title", { required: true })}
                    />
                    <Box mt={4}>
                        <TextArea
                            label="Nội dung *"
                            placeholder="Nội dung, chương trình cuộc họp"
                            status={errors?.content ? "error" : "default"}
                            errorText={errText("content", "Nội dung")}
                            {...register("content", { required: true })}
                        />
                    </Box>
                    <Box mt={4} tw="flex flex-row gap-3">
                        <Box tw="flex-1">
                            <Input
                                label="Ngày * (dd/mm/yyyy)"
                                placeholder="18/06/2024"
                                value={date}
                                status={
                                    date && !isValidDate(date)
                                        ? "error"
                                        : "default"
                                }
                                onChange={e => setDate(e.target.value)}
                            />
                        </Box>
                        <Box tw="flex-1">
                            <Input
                                label="Giờ * (HH:mm)"
                                placeholder="19:30"
                                value={time}
                                status={
                                    time && !isValidTime(time)
                                        ? "error"
                                        : "default"
                                }
                                onChange={e => setTime(e.target.value)}
                            />
                        </Box>
                    </Box>
                    <Box mt={4}>
                        <Input
                            label="Địa điểm *"
                            placeholder="Nhập địa điểm"
                            status={errors?.location ? "error" : "default"}
                            errorText={errText("location", "Địa điểm")}
                            {...register("location", { required: true })}
                        />
                    </Box>
                    <Box mt={4}>
                        <Input
                            label="Chủ trì"
                            placeholder="Người chủ trì"
                            {...register("chairperson")}
                        />
                    </Box>
                    <Box mt={4}>
                        <Select
                            label="Tổ dân phố"
                            placeholder="Chọn tổ dân phố"
                            value={group}
                            onChange={v => setGroup(v as string)}
                        >
                            {NEIGHBORHOOD_GROUPS.map(g => (
                                <Option key={g} value={g} title={g} />
                            ))}
                        </Select>
                    </Box>
                    <Box mt={4}>
                        <TextArea
                            label="Ghi chú"
                            placeholder="Ghi chú thêm (nếu có)"
                            {...register("note")}
                        />
                    </Box>
                    <Box mt={4}>
                        <FileUpload
                            label="Tài liệu liên quan (ảnh/PDF)"
                            value={documents}
                            onChange={setDocuments}
                        />
                    </Box>
                </SectionCard>
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
                    Tạo cuộc họp
                </Button>
            </Box>
        </PageLayout>
    );
};

export default MeetingFormPage;
