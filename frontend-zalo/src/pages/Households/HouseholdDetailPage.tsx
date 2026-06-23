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
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { Input } from "@components";
import { EmptyState, SectionCard, StatusBadge } from "@components/common";
import { useStore } from "@store";
import { ROUTES } from "@constants/common";
import {
    GENDER_OPTIONS,
    RELATION_OPTIONS,
    RESIDENCE_TYPE_OPTIONS,
    householdTypeLabel,
    genderLabel,
} from "@constants/resident-group";
import { Gender, ResidenceType } from "@dts";
import { isValidCitizenId, maskCitizenId } from "@utils/string";

const { Option } = Select;

const Row = styled.div`
    ${tw`flex flex-row justify-between items-start py-2 border-b border-divider_01`}
    &:last-child {
        border-bottom: none;
    }
`;

const MemberRow = styled.div`
    ${tw`py-3 border-b border-divider_01`}
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

const displayToIso = (value?: string) => {
    if (!value) return "";
    const parts = value.split("/");
    if (parts.length !== 3) return "";
    const [d, m, y] = parts;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};

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

const HouseholdDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { openSnackbar } = useSnackbar();

    const [household, loading, getHouseholdDetail, addHouseholdMember, saving] =
        useStore(state => [
            state.householdDetail,
            state.gettingHouseholdDetail,
            state.getHouseholdDetail,
            state.addHouseholdMember,
            state.savingHousehold,
        ]);

    const [showAdd, setShowAdd] = useState(false);
    const [gender, setGender] = useState<Gender | undefined>();
    const [relation, setRelation] = useState<string | undefined>();
    const [residenceType, setResidenceType] = useState<
        ResidenceType | undefined
    >();
    const [mDob, setMDob] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    useEffect(() => {
        if (id) {
            getHouseholdDetail(id);
        }
    }, [id]);

    const resetMemberForm = () => {
        reset({ fullName: "", citizenId: "", phone: "" });
        setGender(undefined);
        setRelation(undefined);
        setResidenceType(undefined);
        setMDob("");
    };

    const onAddMember = handleSubmit(async data => {
        if (!relation) {
            openSnackbar({
                type: "warning",
                text: "Vui lòng chọn quan hệ với chủ hộ",
            });
            return;
        }
        if (!id) return;
        const updated = await addHouseholdMember(id, {
            fullName: data.fullName,
            citizenId: data.citizenId,
            phone: data.phone,
            gender,
            relationToHead: relation,
            residenceType,
            dob: displayToIso(mDob),
            status: "pending",
        });
        if (updated) {
            openSnackbar({ type: "success", text: "Đã thêm thành viên" });
            resetMemberForm();
            setShowAdd(false);
        } else {
            openSnackbar({ type: "error", text: "Thêm thành viên thất bại" });
        }
    });

    if (loading) {
        return (
            <PageLayout title="Chi tiết hộ dân" id="household-detail-loading">
                <Box p={4}>
                    <LoadingBlock />
                </Box>
            </PageLayout>
        );
    }

    if (!household) {
        return (
            <PageLayout title="Chi tiết hộ dân" id="household-detail-empty">
                <EmptyState
                    title="Không tìm thấy hộ dân"
                    actionLabel="Quay lại"
                    onAction={() => navigate(-1)}
                />
            </PageLayout>
        );
    }

    const members = household.members || [];

    return (
        <PageLayout title="Chi tiết hộ dân" id="household-detail-page">
            <Box p={4} tw="bg-ui_bg mb-2">
                <Box tw="flex flex-row items-start justify-between">
                    <Box tw="flex-1 pr-2">
                        <Text size="small" tw="text-main font-medium">
                            {household.code}
                        </Text>
                        <Text.Title size="small" tw="text-text_1">
                            {household.headName}
                        </Text.Title>
                    </Box>
                    <StatusBadge status={household.status} />
                </Box>
                {household.status === "rejected" && household.rejectReason && (
                    <Box
                        mt={3}
                        p={3}
                        tw="rounded-lg"
                        style={{ backgroundColor: "#FEECEC" }}
                    >
                        <Text size="small" tw="text-danger">
                            Lý do từ chối: {household.rejectReason}
                        </Text>
                    </Box>
                )}
            </Box>

            <Box px={4} style={{ paddingBottom: 40 }}>
                <SectionCard title="Thông tin hộ">
                    <InfoRow label="Mã hộ" value={household.code} />
                    <InfoRow label="Chủ hộ" value={household.headName} />
                    <InfoRow label="Địa chỉ" value={household.addressDetail} />
                    <InfoRow
                        label="Tổ dân phố"
                        value={household.neighborhoodGroup}
                    />
                    <InfoRow
                        label="Loại hộ"
                        value={householdTypeLabel(household.householdType)}
                    />
                    <InfoRow
                        label="Số nhân khẩu"
                        value={household.memberCount ?? members.length}
                    />
                    <InfoRow
                        label="Sổ hộ khẩu/cư trú"
                        value={household.residenceBook}
                    />
                </SectionCard>

                <Box mt={3}>
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
                            <MemberRow key={m.id}>
                                <Box tw="flex flex-row items-start justify-between">
                                    <Text tw="text-text_1 font-medium flex-1 pr-2">
                                        {m.fullName}
                                    </Text>
                                    <StatusBadge status={m.status} />
                                </Box>
                                <Text size="small" tw="text-text_2 mt-0.5">
                                    {m.relationToHead} · {genderLabel(m.gender)}{" "}
                                    · CCCD: {maskCitizenId(m.citizenId)}
                                </Text>
                            </MemberRow>
                        ))}

                        {showAdd && (
                            <Box mt={3} pt={3} tw="border-t border-border">
                                <Input
                                    label="Họ và tên *"
                                    placeholder="Nhập họ và tên"
                                    status={
                                        errors?.fullName ? "error" : "default"
                                    }
                                    errorText={
                                        errors?.fullName
                                            ? "Họ và tên không được để trống"
                                            : ""
                                    }
                                    {...register("fullName", {
                                        required: true,
                                    })}
                                />
                                <Box mt={3}>
                                    <Input
                                        label="Số CCCD"
                                        placeholder="Nhập số CCCD"
                                        status={
                                            errors?.citizenId
                                                ? "error"
                                                : "default"
                                        }
                                        errorText={
                                            errors?.citizenId
                                                ? "Số CCCD không hợp lệ"
                                                : ""
                                        }
                                        {...register("citizenId", {
                                            validate: v =>
                                                !v ||
                                                isValidCitizenId(v) ||
                                                false,
                                        })}
                                    />
                                </Box>
                                <Box mt={3}>
                                    <Input
                                        label="Ngày sinh (dd/mm/yyyy)"
                                        placeholder="VD: 12/03/2008"
                                        value={mDob}
                                        onChange={e => setMDob(e.target.value)}
                                    />
                                </Box>
                                <Box mt={3}>
                                    <Select
                                        label="Giới tính"
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
                                <Box mt={3}>
                                    <Select
                                        label="Quan hệ với chủ hộ *"
                                        placeholder="Chọn quan hệ"
                                        value={relation}
                                        onChange={v => setRelation(v as string)}
                                    >
                                        {RELATION_OPTIONS.map(r => (
                                            <Option
                                                key={r}
                                                value={r}
                                                title={r}
                                            />
                                        ))}
                                    </Select>
                                </Box>
                                <Box mt={3}>
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
                                <Button
                                    fullWidth
                                    tw="mt-4"
                                    loading={saving}
                                    onClick={() => onAddMember()}
                                >
                                    Lưu thành viên
                                </Button>
                            </Box>
                        )}
                    </SectionCard>
                </Box>

                {!!household.cultureTitles?.length && (
                    <Box mt={3}>
                        <SectionCard title="Gia đình văn hóa">
                            {household.cultureTitles.map(c => (
                                <Row key={c.id}>
                                    <Text
                                        size="small"
                                        tw="text-text_1 flex-1 pr-2"
                                    >
                                        {c.year} · {c.title}
                                    </Text>
                                    <Text size="xxSmall" tw="text-text_2">
                                        {viDate(c.recognizedDate)}
                                    </Text>
                                </Row>
                            ))}
                        </SectionCard>
                    </Box>
                )}

                <Button
                    variant="secondary"
                    fullWidth
                    tw="mt-4"
                    onClick={() =>
                        navigate(`${ROUTES.HOUSEHOLDS}/${household.id}/edit`, {
                            animate: true,
                            direction: "forward",
                        })
                    }
                >
                    Sửa thông tin hộ
                </Button>
            </Box>
        </PageLayout>
    );
};

export default HouseholdDetailPage;
