export const getAvatarName = ({
    name,
    length = 2,
}: {
    name: string;
    length?: number;
}): string =>
    name
        ?.split(" ")
        .map(str => (str ? str[0].toUpperCase() : ""))
        .join("")
        .slice(0, length);

/*
  generatePath function from  @remix-run/router
 */
export const generatePath = (
    originalPath: string,
    params: { [key: string]: any } = {},
): string => {
    let path = originalPath;

    if (path.endsWith("*") && path !== "*" && !path.endsWith("/*")) {
        path = path.replace(/\*$/, "/*");
    }

    return path
        .replace(/^:(\w+)(\??)/g, (_, key, optional) => {
            const param = params[key];

            if (optional === "?") {
                return param == null ? "" : param;
            }

            return param;
        })
        .replace(/\/:(\w+)(\??)/g, (_, key, optional) => {
            const param = params[key];

            if (optional === "?") {
                return param == null ? "" : `/${param}`;
            }

            return `/${param}`;
        }) // Remove any optional markers from optional static segments
        .replace(/\?/g, "")
        .replace(/(\/?)\*/, (_, prefix, __, str) => {
            const star = "*";

            if (params[star] == null) {
                // If no splat was provided, trim the trailing slash _unless_ it's
                // the entire path
                return str === "/*" ? "/" : "";
            } // Apply the splat

            return `${prefix}${params[star]}`;
        });
};

/**
 * Add leading zero number
 */
export const padWithLeadingZeros = (num: number, totalLength: number) =>
    String(num).padStart(totalLength, "0");

/**
 * Validate phoneNumber
 */
export const isValidPhoneNumber = (number: string) => {
    const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (number.match(phoneno)) {
        return true;
    }
    return false;
};

/**
 * Validate số CCCD/CMND: 12 số (CCCD) hoặc 9 số (CMND cũ)
 */
export const isValidCitizenId = (value: string) => {
    if (!value) {
        return false;
    }
    return /^(\d{9}|\d{12})$/.test(value.trim());
};

/**
 * Che (mask) số CCCD: chỉ hiện 3 số cuối, ví dụ "•••••••••123".
 * Dữ liệu cá nhân nhạy cảm -> mặc định che khi hiển thị cho vai trò hạn chế.
 */
export const maskCitizenId = (value?: string): string => {
    if (!value) {
        return "—";
    }
    const v = value.trim();
    if (v.length <= 3) {
        return v;
    }
    return `${"•".repeat(Math.max(0, v.length - 3))}${v.slice(-3)}`;
};

/**
 * Che (mask) số điện thoại: hiện 3 số đầu và 2 số cuối, ví dụ "090•••••88".
 */
export const maskPhoneNumber = (value?: string): string => {
    if (!value) {
        return "—";
    }
    const v = value.trim();
    if (v.length <= 5) {
        return v;
    }
    return `${v.slice(0, 3)}${"•".repeat(v.length - 5)}${v.slice(-2)}`;
};

/**
 * Bỏ dấu tiếng Việt, dùng cho tìm kiếm không phân biệt dấu.
 */
export const removeVietnameseTones = (str: string): string => {
    if (!str) {
        return "";
    }
    return str
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase();
};

/**
 * So khớp từ khoá có dấu / không dấu trong một danh sách trường văn bản.
 */
export const matchKeyword = (keyword: string, fields: (string | undefined)[]) => {
    const normalizedKeyword = removeVietnameseTones(keyword.trim());
    if (!normalizedKeyword) {
        return true;
    }
    return fields.some(field =>
        removeVietnameseTones(field || "").includes(normalizedKeyword),
    );
};
