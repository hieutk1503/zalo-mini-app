import React, { useState } from "react";
import { Box, Button, Select, useNavigate, useSnackbar } from "zmp-ui";
import { useForm } from "react-hook-form";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { Input, TextArea } from "@components";
import { FileUpload, SectionCard } from "@components/common";
import { useStore } from "@store";
import { ROUTES } from "@constants/common";
import { FUND_SOURCES } from "@constants/finance";
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

const ExpenseFormPage: React.FC = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();

    const [createExpense, saving] = useStore(state => [
        state.createExpense,
        state.savingExpense,
    ]);

    const [fundSource, setFundSource] = useState<string | undefined>();
    const [group, setGroup] = useState<string | undefined>();
    const [expenseDate, setExpenseDate] = useState("");
    const [attachments, setAttachments] = useState<UploadResult[]>([]);

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
        if (!isValidDate(expenseDate)) {
            openSnackbar({
                type: "warning",
                text: "Ngày chi không hợp lệ (dd/mm/yyyy)",
            });
            return;
        }
        const amount = Number(data.amount);
        if (!amount || amount <= 0) {
            openSnackbar({ type: "warning", text: "Số tiền không hợp lệ" });
            return;
        }
        const saved = await createExpense({
            name: data.name,
            purpose: data.purpose,
            amount,
            expenseDate: displayToIso(expenseDate),
            performerName: data.performerName,
            fundSource,
            neighborhoodGroup: group,
            note: data.note,
            status: "recorded",
            attachments: attachments.map((a, i) => ({
                id: `at-${i}`,
                name: a.name,
                url: a.url,
            })),
        });
        if (saved) {
            openSnackbar({ type: "success", text: "Đã tạo khoản chi" });
            navigate(`${ROUTES.EXPENSES}/${saved.id}`, {
                animate: true,
                direction: "forward",
            });
        } else {
            openSnackbar({ type: "error", text: "Tạo khoản chi thất bại" });
        }
    });

    return (
        <PageLayout title="Tạo khoản chi" id="expense-form-page">
            <Box px={4} pt={4} style={{ paddingBottom: 110 }}>
                <SectionCard title="Thông tin khoản chi">
                    <Input
                        label="Tên khoản chi *"
                        placeholder="VD: Mua dụng cụ vệ sinh"
                        status={errors?.name ? "error" : "default"}
                        errorText={errText("name", "Tên khoản chi")}
                        {...register("name", { required: true })}
                    />
                    <Box mt={4}>
                        <TextArea
                            label="Mục đích chi *"
                            placeholder="Mô tả mục đích chi"
                            status={errors?.purpose ? "error" : "default"}
                            errorText={errText("purpose", "Mục đích")}
                            {...register("purpose", { required: true })}
                        />
                    </Box>
                    <Box mt={4}>
                        <Input
                            type="number"
                            label="Số tiền (VNĐ) *"
                            placeholder="VD: 850000"
                            status={errors?.amount ? "error" : "default"}
                            errorText={errText("amount", "Số tiền")}
                            {...register("amount", { required: true })}
                        />
                    </Box>
                    <Box mt={4}>
                        <Input
                            label="Ngày chi * (dd/mm/yyyy)"
                            placeholder="07/06/2024"
                            value={expenseDate}
                            status={
                                expenseDate && !isValidDate(expenseDate)
                                    ? "error"
                                    : "default"
                            }
                            onChange={e => setExpenseDate(e.target.value)}
                        />
                    </Box>
                    <Box mt={4}>
                        <Select
                            label="Nguồn quỹ"
                            placeholder="Chọn nguồn quỹ"
                            value={fundSource}
                            onChange={v => setFundSource(v as string)}
                        >
                            {FUND_SOURCES.map(f => (
                                <Option key={f} value={f} title={f} />
                            ))}
                        </Select>
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
                        <Input
                            label="Người thực hiện"
                            placeholder="Người chi / người lập"
                            {...register("performerName")}
                        />
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
                            label="Chứng từ đính kèm (ảnh/PDF)"
                            value={attachments}
                            onChange={setAttachments}
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
                    Tạo khoản chi
                </Button>
            </Box>
        </PageLayout>
    );
};

export default ExpenseFormPage;
