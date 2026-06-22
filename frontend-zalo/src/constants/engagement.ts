/**
 * Nhãn & meta cho module Khảo sát và Cuộc thi.
 */
import { ContestStatus, SurveyStatus } from "@dts";
import { BadgeMeta } from "./status";

export const SURVEY_STATUS_META: Record<SurveyStatus, BadgeMeta> = {
    draft: { label: "Nháp", color: "#767A7F", bg: "#F4F5F6" },
    active: { label: "Đang mở", color: "#16A34A", bg: "#EAF8EF" },
    closed: { label: "Đã đóng", color: "#767A7F", bg: "#E9EBED" },
};

export const CONTEST_STATUS_META: Record<ContestStatus, BadgeMeta> = {
    upcoming: { label: "Sắp diễn ra", color: "#0284C7", bg: "#E8F6FC" },
    active: { label: "Đang mở", color: "#16A34A", bg: "#EAF8EF" },
    closed: { label: "Đã đóng", color: "#767A7F", bg: "#E9EBED" },
};
