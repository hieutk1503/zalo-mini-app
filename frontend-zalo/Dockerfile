# ============================================================
# Stage 1 – Build
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Cài dependencies trước (tận dụng Docker layer cache)
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Copy toàn bộ source
COPY . .

# Nhận BASE_URL qua build-arg để nhúng đúng vào bundle
ARG VITE_BASE_URL=http://localhost:8090
ARG VITE_USE_MOCK=false
ARG VITE_DEV_TOKEN=dev-token-local
ARG VITE_MINI_APP_ID=dev-mini-app-id

# Ghi đè .env.production bằng giá trị build-arg
RUN printf "VITE_BASE_URL=%s\nVITE_MINI_APP_ID=%s\nVITE_USE_MOCK=%s\nVITE_DEV_TOKEN=%s\n" \
    "$VITE_BASE_URL" "$VITE_MINI_APP_ID" "$VITE_USE_MOCK" "$VITE_DEV_TOKEN" \
    > .env.production

# Build bằng Vite trực tiếp (zmp build = wrapper của Vite, nhưng cần login Zalo)
# Dùng config riêng cho Docker: vite.docker.config.ts đã đặt sẵn
#   root: "."  (index.html ở project root, không phải ./src)
#   build.outDir: "www" + emptyOutDir: true  (output ra www/ cho Nginx serve)
# (Vite 2.9 không nhận cờ --root nên phải truyền qua --config)
RUN npx vite build --config vite.docker.config.ts

# ============================================================
# Stage 2 – Serve với Nginx
# ============================================================
FROM nginx:1.27-alpine AS runner

# Xoá trang mặc định
RUN rm -rf /usr/share/nginx/html/*

# Copy bundle từ stage builder
COPY --from=builder /app/www /usr/share/nginx/html

# Copy cấu hình Nginx tùy chỉnh
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
