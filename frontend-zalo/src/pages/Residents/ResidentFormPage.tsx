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
    GENDER_OPTIONS,
    NEIGHBORHOOD_GROUPS,
    RELATION_OPTIONS,
    RESIDENCE_TYPE_OPTIONS,
} from "@constants/resident-group";
import { Gender, ResidenceType } from "@dts";
import { isValidCitizenId, isValidPhoneNumber } from "@utils/string";

const { Option } = Select;

const isoToDisplay = (iso?: string) =>
    iso ? iso.split("-").reverse().join("/") : "";

const displayToIso = (value?: string) => {
    if (!value) {
        return "";
    }
    const parts = value.split("/");
    if (parts.length !== 3) {
        return "";
    }
    const [d, m, y] = parts;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};

const isValidDob = (value: string) =>
    /^\d{2}\/\d{2}\/\d{4}$/.test(value.trim());

const ResidentFormPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const isEdit = !!id;
    const { openSnackbar } = useSnackbar();

    const [residentDetail, getResidentDetail, saveResident, saving] = useStore(
        state => [
            state.residentDetail,
            state.getResidentDetail,
            state.saveResident,
            state.savingResident,
        ],
    );

    const [gender, setGender] = useState<Gender | undefined>();
    const [group, setGroup] = useState<string | undefined>();
    const [relation, setRelation] = useState<string | undefined>();
    const [residenceType, setResidenceType] = useState<
        ResidenceType | undefined
    >();
    const [dob, setDob] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    useEffect(() => {
        if (isEdit && id) {
            getResidentDetail(id);
        }
    }, [id]);

    // Prefill khi vào màn sửa và dữ liệu đã tải.
    useEffect(() => {
        if (isEdit && residentDetail && residentDetail.id === id) {
            reset({
                fullName: residentDetail.fullName,
                citizenId: residentDetail.citizenId,
                phone: residentDetail.phone,
                email: residentDetail.email,
                permanentAddress: residentDetail.permanentAddress,
                currentAddress: residentDetail.currentAddress,
                householdCode: residentDetail.householdCode,
                note: residentDetail.note,
            });
            setGender(residentDetail.gender);
            setGroup(residentDetail.neighborhoodGroup);
            setRelation(residentDetail.relationToHead);
            setResidenceType(residentDetail.residenceType);
            setDob(isoToDisplay(residentDetail.dob));
        }
    }, [residentDetail, isEdit, id]);

    const errText = (field: string, label: string) => {
        if (!errors[field]) {
            return "";
        }
        if (errors[field]?.type === "required") {
            return `${label} không được để trống`;
        }
        return `${label} không hợp lệ`;
    };

    const onSubmit = (statusValue?: "draft" | "pending") =>
        handleSubmit(async data => {
            if (!gender || !group || !relation) {
                openSnackbar({
                    type: "warning",
                    text: "Vui lòng chọn Giới tính, Tổ dân phố và Quan hệ với chủ hộ",
                });
                return;
            }
            const payload = {
                ...data,
                gender,
                neighborhoodGroup: group,
                relationToHead: relation,
                residenceType,
                dob: displayToIso(dob),
                ...(statusValue ? { status: statusValue } : {}),
            };
            const saved = await saveResident({ id, payload });
            if (saved) {
                openSnackbar({
                    type: "success",
                    text: isEdit ? "Đã lưu thông tin" : "Đã tạo cư dân",
                });
                navigate(`${ROUTES.RESIDENTS}/${saved.id}`, {
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
            title={isEdit ? "Sửa cư dân" : "Thêm cư dân"}
            id="resident-form-page"
        >
            <Box px={4} pt={4} style={{ paddingBottom: 120 }}>
                <SectionCard title="Thông tin định danh">
                    <Input
                        label="Họ và tên *"
                        placeholder="Nhập họ và tên"
                        status={errors?.fullName ? "error" : "default"}
                        errorText={errText("fullName", "Họ và tên")}
                        {...register("fullName", { required: true })}
                    />
                    <Box mt={4}>
                        <Input
                            label="Số CCCD *"
                            placeholder="Nhập số CCCD (12 số)"
                            status={errors?.citizenId ? "error" : "default"}
                            errorText={errText("citizenId", "Số CCCD")}
                            {...register("citizenId", {
                                required: true,
                                validate: v => isValidCitizenId(v),
                            })}
                        />
                    </Box>
                    <Box mt={4}>
                        <Input
                            label="Ngày sinh * (dd/mm/yyyy)"
                            placeholder="VD: 20/05/1990"
                            value={dob}
                            status={
                                dob && !isValidDob(dob) ? "error" : "default"
                            }
                            errorText={
                                dob && !isValidDob(dob)
                                    ? "Ngày sinh không hợp lệ"
                                    : ""
                            }
                            onChange={e => setDob(e.target.value)}
                        />
                    </Box>
                    <Box mt={4}>
                        <Select
                            label="Giới tính *"
                            placeholder="Chọn giới tính"
                            value={gender}
                            onChange={v => setGender(v as Gender)}
                        >
                            {GENDER_OPTIONS.map(o => (
                                <Option
                                    key={o.value}
                                    value={o.value}
                                    title={o.label}
                                />
                            ))}
                        </Select>
                    </Box>
                </SectionCard>

                <Box mt={3}>
                    <SectionCard title="Liên hệ & cư trú">
                        <Input
                            label="Số điện thoại"
                            placeholder="Nhập số điện thoại"
                            status={errors?.phone ? "error" : "default"}
                            errorText={errText("phone", "Số điện thoại")}
                            {...register("phone", {
                                validate: v =>
                                    !v || isValidPhoneNumber(v) || false,
                            })}
                        />
                        <Box mt={4}>
                            <Input
                                label="Email"
                                placeholder="Nhập email"
                                {...register("email")}
                            />
                        </Box>
                        <Box mt={4}>
                            <Select
                                label="Loại cư trú"
                                placeholder="Chọn loại cư trú"
                                value={residenceType}
                                onChange={v =>
                                    setResidenceType(v as ResidenceType)
                                }
                            >
                                {RESIDENCE_TYPE_OPTIONS.map(o => (
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
                                label="Địa chỉ thường trú"
                                placeholder="Nhập địa chỉ thường trú"
                                {...register("permanentAddress")}
                            />
                        </Box>
                        <Box mt={4}>
                            <TextArea
                                label="Địa chỉ hiện tại *"
                                placeholder="Nhập địa chỉ hiện tại"
                                status={
                                    errors?.currentAddress ? "error" : "default"
                                }
                                errorText={errText(
                                    "currentAddress",
                                    "Địa chỉ hiện tại",
                                )}
                                {...register("currentAddress", {
                                    required: true,
                                })}
                            />
                        </Box>
                    </SectionCard>
                </Box>

                <Box mt={3}>
                    <SectionCard title="Hộ dân & địa bàn">
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
                        <Box mt={4}>
                            <Select
                                label="Quan hệ với chủ hộ *"
                                placeholder="Chọn quan hệ"
                                value={relation}
                                onChange={v => setRelation(v as string)}
                            >
                                {RELATION_OPTIONS.map(r => (
                                    <Option key={r} value={r} title={r} />
                                ))}
                            </Select>
                        </Box>
                        <Box mt={4}>
                            <Input
                                label="Mã hộ dân"
                                placeholder="VD: HK-001"
                                {...register("householdCode")}
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
                </Box>

                <Text size="xxSmall" tw="text-text_2 mt-3">
                    Dữ liệu cư dân là thông tin cá nhân nhạy cảm. Vui lòng nhập
                    đúng và chỉ gửi khi đã kiểm tra.
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

export default ResidentFormPage;
