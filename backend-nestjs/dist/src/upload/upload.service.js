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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
exports.feedbackImageFilename = feedbackImageFilename;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const crypto_1 = require("crypto");
const env_1 = require("../config/env");
let UploadService = class UploadService {
    feedbackDir = (0, path_1.join)(process.cwd(), env_1.env.uploadDir, 'feedbacks');
    constructor() {
        (0, fs_1.mkdirSync)(this.feedbackDir, { recursive: true });
    }
    buildPublicUrl(filename) {
        return `${env_1.env.apiPublicUrl.replace(/\/$/, '')}/uploads/feedbacks/${filename}`;
    }
    saveFeedbackImages(files) {
        return files.map((file) => this.buildPublicUrl(file.filename));
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadService);
function feedbackImageFilename(originalName) {
    const ext = originalName.includes('.')
        ? originalName.slice(originalName.lastIndexOf('.'))
        : '.jpg';
    return `${(0, crypto_1.randomUUID)()}${ext.toLowerCase()}`;
}
//# sourceMappingURL=upload.service.js.map