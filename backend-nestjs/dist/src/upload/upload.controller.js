"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const soft_auth_guard_1 = require("../auth/soft-auth.guard");
const env_1 = require("../config/env");
const upload_service_1 = require("./upload.service");
const imageFilter = (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        cb(null, false);
        return;
    }
    cb(null, true);
};
let UploadController = class UploadController {
    uploadService;
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    uploadImages(files) {
        const urls = this.uploadService.saveFeedbackImages(files || []);
        return { urls };
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('images'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 5, {
        storage: (0, multer_1.diskStorage)({
            destination: (0, path_1.join)(process.cwd(), env_1.env.uploadDir, 'feedbacks'),
            filename: (_req, file, cb) => {
                cb(null, (0, upload_service_1.feedbackImageFilename)(file.originalname));
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: imageFilter,
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "uploadImages", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.Controller)('upload'),
    (0, common_1.UseGuards)(soft_auth_guard_1.SoftAuthGuard),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map