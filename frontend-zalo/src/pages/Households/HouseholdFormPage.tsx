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
import { useForm } from "react-hook-form";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { Input, TextArea } from "@components";
import { SectionCard } from "@components/common";
import { useStore } from "@store";
import { ROUTES } from "@constants/common";
import {
    HOUSEHOLD_TYPE_OPTIONS,
    NEIGHBORHOOD_GROUPS,
} from "@constants/resident-group";
import { HouseholdType } from "@dts";

const { Option } = Select;

const HouseholdFormPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const isEdit = !!id;
    const { openSnackbar } = useSnackbar();

    const [householdDetail, getHouseholdDetail, saveHousehold, saving] =
        useStore(state => [
            state.householdDetail,
            state.getHouseholdDetail,
            state.saveHousehold,
            state.savingHousehold,
        ]);

    const [group, setGroup] = useState<string | undefined>();
    const [householdType, setHouseholdType] = useState<
        HouseholdType | undefined
    >();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    useEffect(() => {
        if (isEdit && id) {
            getHouseholdDetail(id);
        }
    }, [id]);

    useEffect(() => {
        if (isEdit && householdDetail && householdDetail.id === id) {
            reset({
                code: householdDetail.code,
                headName: householdDetail.headName,
                houseNumber: householdDetail.houseNumber,
                addressDetail: householdDetail.addressDetail,
                residenceBook: householdDetail.residenceBook,
                note: householdDetail.note,
            });
            setGroup(householdDetail.neighborhoodGroup);
            setHouseholdType(householdDetail.householdType);
        }
    }, [householdDetail, isEdit, id]);

    const errText = (field: string, label: string) => {
        if (!errors[field]) return "";
        if (errors[field]?.type === "required")
            return `${label} không được để trống`;
        return `${label} không hợp lệ`;
    };

    const onSubmit = (statusValue?: "draft" | "pending") =>
        handleSubmit(async data => {
            if (!group) {
                openSnackbar({
                    type: "warning",
                    text: "Vui lòng chọn Tổ dân phố",
                });
                return;
            }
            const payload = {
                ...data,
                neighborhoodGroup: group,
                householdType,
                ...(statusValue ? { status: statusValue } : {}),
            };
            const saved = await saveHousehold({ id, payload });
            if (saved) {
                openSnackbar({
                    type: "success",
                    text: isEdit ? "Đã lưu thông tin hộ" : "Đã tạo hộ dân",
                });
                navigate(`${ROUTES.HOUSEHOLDS}/${saved.id}`, {
                    animate: true,
                    direction: "forward",
                });
            } else {
                openSnackbar({
                    type: "error",
                    text: "Lưu thất bại, vui lòng thử lại",
                });
            }
        })();

    return (
        <PageLayout
            title={isEdit ? "Sửa hộ dân" : "Thêm hộ dân"}
            id="household-form-page"
        >
            <Box px={4} pt={4} style={{ paddingBottom: 120 }}>
                <SectionCard title="Thông tin hộ">
                    <Input
                        label="Mã hộ"
                        placeholder="Tự sinh nếu để trống (VD: HK-001)"
                        {...register("code")}
                    />
                    <Box mt={4}>
                        <Input
                            label="Chủ hộ *"
                            placeholder="Họ và tên chủ hộ"
                            status={errors?.headName ? "error" : "default"}
                            errorText={errText("headName", "Chủ hộ")}
                            {...register("headName", { required: true })}
                        />
                    </Box>
                    <Box mt={4}>
                        <Input
                            label="Số nhà / đường"
                            placeholder="VD: 12 Hoa Lư"
                            {...register("houseNumber")}
                        />
                    </Box>
                    <Box mt={4}>
                        <TextArea
                            label="Địa chỉ chi tiết *"
                            placeholder="Nhập địa chỉ chi tiết"
                            status={errors?.addressDetail ? "error" : "default"}
                            errorText={errText("addressDetail", "Địa chỉ")}
                            {...register("addressDetail", { required: true })}
                        />
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
                        <Select
                            label="Loại hộ"
                            placeholder="Chọn loại hộ"
                            value={householdType}
                            onChange={v => setHouseholdType(v as HouseholdType)}
                        >
                            {HOUSEHOLD_TYPE_OPTIONS.map(o => (
                                <Option
                                    key={o.value}
                                    value={o.value}
                                    title={o.label}
                                />
                            ))}
                        </Select>
                    </Box>
                    <Box mt={4}>
                        <Input
                            label="Sổ hộ khẩu / cư trú"
                            placeholder="Số sổ (nếu có)"
                            {...register("residenceBook")}
                        />
                    </Box>
                    <Box mt={4}>
                        <TextArea
                            label="Ghi chú"
                            placeholder="Ghi chú thêm (nếu có)"
                            {...register("note")}
                        />
                    </Box>
                </SectionCard>

                <Text size="xxSmall" tw="text-text_2 mt-3">
                    Sau khi tạo hộ, thêm thành viên trong màn chi tiết hộ.
                </Text>
            </Box>

            <Box
                tw="fixed left-0 right-0 px-4 bg-ui_bg pt-3 flex flex-row gap-3 border-t border-border"
                style={{
                    bottom: 0,
                    paddingBottom:
                        "calc(var(--zaui-safe-area-inset-bottom, 0px) + 12px)",
                }}
            >
                <Button
                    variant="secondary"
                    tw="flex-1"
                    loading={saving}
                    onClick={() => onSubmit(isEdit ? undefined : "draft")}
                >
                    {isEdit ? "Lưu" : "Lưu nháp"}
                </Button>
                <Button
                    tw="flex-1"
                    loading={saving}
                    onClick={() => onSubmit("pending")}
                >
                    Gửi xác nhận
                </Button>
            </Box>
        </PageLayout>
    );
};

export default HouseholdFormPage;
