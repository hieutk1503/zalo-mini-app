import { describe, it, expect } from "vitest";
import {
    getProcedures,
    getDocuments,
    getProjects,
    getBiddings,
    sendChatMessage,
} from "./egov.services.mock";

describe("getProcedures (mock)", () => {
    it("lọc theo từ khoá không dấu", async () => {
        const res = await getProcedures({ keyword: "khai sinh" });
        expect(res.procedures.length).toBeGreaterThan(0);
        expect(res.procedures.some(p => p.name.includes("khai sinh"))).toBe(
            true,
        );
    });
    it("lọc theo lĩnh vực", async () => {
        const res = await getProcedures({ category: "Chứng thực" });
        expect(res.procedures.every(p => p.category === "Chứng thực")).toBe(
            true,
        );
    });
});

describe("getDocuments (mock)", () => {
    it("lọc theo loại văn bản", async () => {
        const res = await getDocuments({ type: "form" });
        expect(res.documents.length).toBeGreaterThan(0);
        expect(res.documents.every(d => d.type === "form")).toBe(true);
    });
});

describe("getProjects / getBiddings (mock)", () => {
    it("trả về danh sách dự án", async () => {
        const res = await getProjects();
        expect(res.projects.length).toBeGreaterThan(0);
    });
    it("trả về danh sách gói thầu", async () => {
        const res = await getBiddings();
        expect(res.biddings.length).toBeGreaterThan(0);
    });
});

describe("sendChatMessage (mock)", () => {
    it("trả lời theo thủ tục khi khớp", async () => {
        const reply = await sendChatMessage({ message: "đăng ký kết hôn" });
        expect(reply.answer).toContain("Đăng ký kết hôn");
        expect(reply.suggestions && reply.suggestions.length).toBeTruthy();
    });
    it("fallback khi không khớp", async () => {
        const reply = await sendChatMessage({
            message: "xyz không liên quan 123",
        });
        expect(reply.answer).toContain("Xin lỗi");
    });
});
