/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./index.html"
    ],
    theme: {
        extend: {
            colors: {
                main: "var(--main, #C8102E)",
                wth_a70: "rgba(255, 255, 255, 0.7)",
                ui_bg: "#FFFFFF",
                text_1: "#141415",
                text_2: "#767A7F",
                text_3: "#B9BDC1",
                devider_1: "#E9EBED",
                icon_bg: "#F5F9FC",
                blue_10: "#EBF4FF",
                ng_10: "#F4F5F6",
                ng_20: "#E9EBED",
                blk_a70: "rgba(0, 0, 0, 0.7)",
                blk_a20: "rgba(0, 0, 0, 0.2)",
                divider_01: "#E9EBED",
                /* === Token bổ sung theo egov-dss-ui-design-system.md === */
                /* Giữ nguyên các token cũ ở trên; chỉ thêm mới bên dưới. */
                primary_700: "#A4161A",
                primary_50: "#FCEAEC",
                success: "#16A34A",
                success_50: "#EAF8EF",
                warning: "#F59E0B",
                warning_50: "#FFF7E6",
                danger: "#DC2626",
                danger_50: "#FEECEC",
                info: "#0284C7",
                info_50: "#E8F6FC",
                forwarded: "#7C3AED",
                forwarded_50: "#F3E8FF",
                surface: "#F3F5F7",
                border: "#E5E7EB",
            },
        },
    },
    plugins: [],
};
