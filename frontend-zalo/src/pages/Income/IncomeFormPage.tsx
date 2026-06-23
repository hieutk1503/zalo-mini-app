import React, { useState } from "react";
import { Box, Button, Select, Text, useNavigate, useSnackbar } from "zmp-ui";
import { useForm } from "react-hook-form";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { Input, TextArea } from "@components";
import { SectionCard } from "@components/common";
import { useStore } from "@store";
import { ROUTES } from "@constants/common";
import { FEE_TYPES } from "@constants/finance";
import { NEIGHBORHOOD_GROUPS } from "@constants/resident-group";

const { Option } = Select;

const displayToIso = (value?: string) => {
    if (!value) return "";
    const parts = value.split("/");
    if (parts.length !== 3) return "";
    const [d, m, y] = parts;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};

const isValidDate = (v: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(v.trim());

const IncomeFormPage: React.FC = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();

    const [createIncomeCampaign, saving] = useStore(state => [
        state.createIncomeCampaign,
        state.savingIncomeCampaign,
    ]);

    const [feeType, setFeeType] = useState<string | undefined>();
    const [group, setGroup] = useState<string | undefined>();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    const onSubmit = handleSubmit(async data => {
        if (!feeType || !group) {
            openSnackbar({
                type: "warning",
                text: "Vui lòng chọn loại khoản thu và tổ dân phố",
            });
            return;
        }
        if (!isValidDate(startDate)) {
            openSnackbar({
                type: "warning",
                text: "Ngày bắt đầu không hợp lệ (dd/mm/yyyy)",
            });
            return;
        }
        const saved = await createIncomeCampaign({
            name: data.name,
            description: data.description,
            feeType,
            neighborhoodGroup: group,
            amountPerHousehold: Number(data.amountPerHousehold) || 0,
            startDate: displayToIso(startDate),
            endDate:
                endDate && isValidDate(endDate)
                    ? displayToIso(endDate)
                    : undefined,
            status: "active",
            households: [],
        });
        if (saved) {
            openSnackbar({ type: "success", text: "Đã tạo đợt thu" });
            navigate(`${ROUTES.INCOME}/${saved.id}`, {
                animate: true,
                direction: "forward",
            });
        } else {
            openSnackbar({ type: "error", text: "Tạo đợt thu thất bại" });
        }
    });

    return (
        <PageLayout title="Tạo đợt thu" id="income-form-page">
            <Box px={4} pt={4} style={{ paddingBottom: 110 }}>
                <SectionCard title="Thông tin đợt thu">
                    <Input
                        label="Tên đợt thu *"
                        placeholder="VD: Quỹ vệ sinh môi trường Q3"
                        status={errors?.name ? "error" : "default"}
                        errorText={
                            errors?.name
                                ? "Tên đợt thu không được để trống"
                                : ""
                        }
                        {...register("name", { required: true })}
                    />
                    <Box mt={4}>
                        <Select
                            label="Loại khoản thu *"
                            placeholder="Chọn loại khoản thu"
                            value={feeType}
                            onChange={v => setFeeType(v as string)}
                        >
                            {FEE_TYPES.map(f => (
                                <Option key={f} value={f} title={f} />
                            ))}
                        </Select>
                    </Box>
                    <Box mt={4}>
                        <Select
                            label="Tổ dân phố *"
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
                        <Input
                            type="number"
                            label="Số tiền mỗi hộ (VNĐ)"
                            placeholder="VD: 60000"
                            {...register("amountPerHousehold")}
                        />
                    </Box>
                    <Box mt={4} tw="flex flex-row gap-3">
                        <Box tw="flex-1">
                            <Input
                                label="Bắt đầu * (dd/mm/yyyy)"
                                placeholder="01/07/2024"
                                value={startDate}
                                status={
                                    startDate && !isValidDate(startDate)
                                        ? "error"
                                        : "default"
                                }
                                onChange={e => setStartDate(e.target.value)}
                            />
                        </Box>
                        <Box tw="flex-1">
                            <Input
                                label="Kết thúc (dd/mm/yyyy)"
                                placeholder="31/07/2024"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                            />
                        </Box>
                    </Box>
                    <Box mt={4}>
                        <TextArea
                            label="Mô tả / mục đích"
                            placeholder="Mục đích khoản thu"
                            {...register("description")}
                        />
                    </Box>
                </SectionCard>

                <Text size="xxSmall" tw="text-text_2 mt-3">
                    Sau khi tạo, có thể bổ sung danh sách hộ và cập nhật trạng
                    thái đóng trong màn chi tiết.
                </Text>
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
                    Tạo đợt thu
                </Button>
            </Box>
        </PageLayout>
    );
};

export default IncomeFormPage;
