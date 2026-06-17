"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
exports.isZaloAuthConfigured = isZaloAuthConfigured;
exports.allowDevHeaderAuth = allowDevHeaderAuth;
function requireEnv(key, devFallback) {
    const value = process.env[key]?.trim();
    if (value)
        return value;
    if (devFallback !== undefined && process.env.NODE_ENV !== 'production') {
        return devFallback;
    }
    throw new Error(`Missing required environment variable: ${key}`);
}
exports.env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    databaseUrl: requireEnv('DATABASE_URL', 'postgresql://root:password@127.0.0.1:5433/tu_lan_smart?schema=public'),
    aiServiceUrl: requireEnv('AI_SERVICE_URL', 'http://127.0.0.1:8000'),
    apiPublicUrl: requireEnv('API_PUBLIC_URL', 'http://localhost:3000'),
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
    zaloAppId: process.env.ZALO_APP_ID?.trim(),
    zaloAppSecret: process.env.ZALO_APP_SECRET?.trim(),
    zaloAuthDevMode: process.env.ZALO_AUTH_DEV_MODE === 'true',
};
function isZaloAuthConfigured() {
    return Boolean(exports.env.zaloAppId && exports.env.zaloAppSecret);
}
function allowDevHeaderAuth() {
    return exports.env.zaloAuthDevMode || (!isZaloAuthConfigured() && exports.env.nodeEnv !== 'production');
}
//# sourceMappingURL=env.js.map