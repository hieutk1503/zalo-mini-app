import { describe, it, expect } from "vitest";
import {
    isValidPhoneNumber,
    isValidCitizenId,
    removeVietnameseTones,
    matchKeyword,
    padWithLeadingZeros,
} from "./string";

describe("isValidCitizenId", () => {
    it("chấp nhận CCCD 12 số và CMND 9 số", () => {
        expect(isValidCitizenId("012345678912")).toBe(true);
        expect(isValidCitizenId("123456789")).toBe(true);
    });
    it("từ chối độ dài sai hoặc có ký tự lạ", () => {
        expect(isValidCitizenId("12345")).toBe(false);
        expect(isValidCitizenId("12345678901a")).toBe(false);
        expect(isValidCitizenId("")).toBe(false);
    });
});

describe("isValidPhoneNumber", () => {
    it("chấp nhận số 10 chữ số", () => {
        expect(isValidPhoneNumber("0123456789")).toBe(true);
    });
    it("từ chối chuỗi không phải số điện thoại", () => {
        expect(isValidPhoneNumber("abc")).toBe(false);
        expect(isValidPhoneNumber("123")).toBe(false);
    });
});

describe("removeVietnameseTones", () => {
    it("bỏ dấu và hạ chữ thường", () => {
        expect(removeVietnameseTones("Đăng ký Khai Sinh")).toBe(
            "dang ky khai sinh",
        );
        expect(removeVietnameseTones("Chứng thực")).toBe("chung thuc");
    });
});

describe("matchKeyword", () => {
    it("khớp không phân biệt dấu", () => {
        expect(matchKeyword("khai sinh", ["Đăng ký khai sinh"])).toBe(true);
        expect(matchKeyword("KHAI SINH", ["Đăng ký khai sinh"])).toBe(true);
        expect(matchKeyword("ket hon", ["Đăng ký kết hôn"])).toBe(true);
    });
    it("trả về false khi không khớp", () => {
        expect(matchKeyword("đấu thầu", ["Đăng ký khai sinh"])).toBe(false);
    });
    it("từ khoá rỗng luôn khớp", () => {
        expect(matchKeyword("", ["bất kỳ"])).toBe(true);
    });
});

describe("padWithLeadingZeros", () => {
    it("thêm số 0 ở đầu", () => {
        expect(padWithLeadingZeros(7, 4)).toBe("0007");
    });
});
