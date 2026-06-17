"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const path_1 = require("path");
const app_module_1 = require("./app.module");
const env_1 = require("./config/env");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });
    app.useStaticAssets((0, path_1.join)(process.cwd(), env_1.env.uploadDir), {
        prefix: '/uploads/',
    });
    await app.listen(env_1.env.port);
}
void bootstrap();
//# sourceMappingURL=main.js.map