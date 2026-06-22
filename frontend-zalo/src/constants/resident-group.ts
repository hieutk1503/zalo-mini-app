/**
 * Danh mục lựa chọn cho module Cư dân / Hộ dân.
 * Đây là dữ liệu cấu hình MẪU (mock) — thực tế lấy từ backend theo địa bàn.
 */
import {
    Gender,
    HouseholdType,
    ResidenceType,
} from "@dts";

export interface Option<T = string> {
    value: T;
    label: string;
}

/** Tổ dân phố / khu phố (mock - thay bằng API /neighborhood-groups). */
export const NEIGHBORHOOD_GROUPS: string[] = [
    "Tổ dân phố 1",
    "Tổ dân phố 2",
    "Tổ dân phố 3",
    "Tổ dân phố 4",
    "Tổ dân phố 5",
];

export const GENDER_OPTIONS: Option<Gender>[] = [
    { value: "male", label: "Nam" },
    { value: "female", label: "Nữ" },
    { value: "other", label: "Khác" },
];

export const RESIDENCE_TYPE_OPTIONS: Option<ResidenceType>[] = [
    { value: "permanent", label: "Thường trú" },
    { value: "temporary", label: "Tạm trú" },
];

export const HOUSEHOLD_TYPE_OPTIONS: Option<HouseholdType>[] = [
    { value: "permanent", label: "Thường trú" },
    { value: "temporary", label: "Tạm trú" },
    { value: "rental", label: "Nhà trọ" },
];

/** Quan hệ với chủ hộ */
export const RELATION_OPTIONS: string[] = [
    "Chủ hộ",
    "Vợ",
    "Chồng",
    "Con",
    "Cha",
    "Mẹ",
    "Ông",
    "Bà",
    "Anh",
    "Chị",
    "Em",
    "Khác",
];

export const genderLabel = (value?: Gender): string =>
    GENDER_OPTIONS.find(o => o.value === value)?.label || "—";

export const residenceTypeLabel = (value?: ResidenceType): string =>
    RESIDENCE_TYPE_OPTIONS.find(o => o.value === value)?.label || "—";

export const householdTypeLabel = (value?: HouseholdType): string =>
    HOUSEHOLD_TYPE_OPTIONS.find(o => o.value === value)?.label || "—";
