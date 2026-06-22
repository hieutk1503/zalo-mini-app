/**
 * Vite config dùng riêng để build trong Docker.
 * Khác vite.config.ts ở chỗ:
 *   - root: "."   → index.html ở project root (không phải ./src)
 *   - build.outDir: "www" → output ra www/ để Nginx serve
 *
 * Dùng bằng lệnh: npx vite build --config vite.docker.config.ts
 */
import path from "path";
import { defineConfig } from "vite";
import macrosPlugin from "vite-plugin-babel-macros";

export default defineConfig({
    root: ".",
    base: "./",
    plugins: [macrosPlugin()],
    build: {
        target: "es2020",
        outDir: "www",
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            "@assets": path.resolve(__dirname, "src/assets"),
            "@components": path.resolve(__dirname, "src/components"),
            "@common": path.resolve(__dirname, "src/common"),
            "@constants": path.resolve(__dirname, "src/constants"),
            "@routes": path.resolve(__dirname, "src/routes"),
            "@shared": path.resolve(__dirname, "src/shared"),
            "@utils": path.resolve(__dirname, "src/utils"),
            "@pages": path.resolve(__dirname, "src/pages"),
            "@dts": path.resolve(__dirname, "src/types"),
            "@state": path.resolve(__dirname, "src/state"),
            "@service": path.resolve(__dirname, "src/service"),
            "@store": path.resolve(__dirname, "src/store"),
            "@mock": path.resolve(__dirname, "src/mock"),
        },
    },
});
