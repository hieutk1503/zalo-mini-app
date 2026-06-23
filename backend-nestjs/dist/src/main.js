"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const path_1 = require("path");
const app_module_1 = require("./app.module");
const env_1 = require("./config/env");
const helmet_1 = __importDefault(require("helmet"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: env_1.env.nodeEnv === 'production'
            ? ['https://your-zalo-domain.com']
            : true,
        credentials: true,
    });
    app.useStaticAssets((0, path_1.join)(process.cwd(), env_1.env.uploadDir), {
        prefix: '/uploads/',
    });
    await app.listen(env_1.env.port);
}
void bootstrap();
//# sourceMappingURL=main.js.map