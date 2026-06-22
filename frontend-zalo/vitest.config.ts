import { defineConfig } from "vitest/config";
import path from "path";

// Cấu hình test riêng, alias khớp với vite.config.ts để import @utils, @mock, @dts...
export default defineConfig({
    resolve: {
        alias: {
            "@assets": path.resolve(__dirname, "src/assets"),
            "@components": path.resolve(__dirname, "src/components"),
            "@constants": path.resolve(__dirname, "src/constants"),
            "@utils": path.resolve(__dirname, "src/utils"),
            "@pages": path.resolve(__dirname, "src/pages"),
            "@dts": path.resolve(__dirname, "src/types"),
            "@service": path.resolve(__dirname, "src/service"),
            "@store": path.resolve(__dirname, "src/store"),
            "@mock": path.resolve(__dirname, "src/mock"),
        },
    },
    test: {
        environment: "node",
        globals: true,
        include: ["src/**/*.test.ts"],
    },
});
