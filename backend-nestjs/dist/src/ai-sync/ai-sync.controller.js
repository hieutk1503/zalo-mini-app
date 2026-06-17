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
exports.AiSyncController = void 0;
const common_1 = require("@nestjs/common");
const ai_sync_service_1 = require("./ai-sync.service");
const admin_auth_guard_1 = require("../admin-auth/admin-auth.guard");
let AiSyncController = class AiSyncController {
    aiSyncService;
    constructor(aiSyncService) {
        this.aiSyncService = aiSyncService;
    }
    async triggerAll() {
        return this.aiSyncService.syncAllKnowledge();
    }
};
exports.AiSyncController = AiSyncController;
__decorate([
    (0, common_1.Post)('trigger-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiSyncController.prototype, "triggerAll", null);
exports.AiSyncController = AiSyncController = __decorate([
    (0, common_1.Controller)('ai-sync'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    __metadata("design:paramtypes", [ai_sync_service_1.AiSyncService])
], AiSyncController);
//# sourceMappingURL=ai-sync.controller.js.map