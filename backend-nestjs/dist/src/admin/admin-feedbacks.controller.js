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
exports.AdminFeedbacksController = void 0;
const common_1 = require("@nestjs/common");
const admin_feedbacks_service_1 = require("./admin-feedbacks.service");
const admin_auth_guard_1 = require("../admin-auth/admin-auth.guard");
let AdminFeedbacksController = class AdminFeedbacksController {
    adminFeedbacksService;
    constructor(adminFeedbacksService) {
        this.adminFeedbacksService = adminFeedbacksService;
    }
    findAll() {
        return this.adminFeedbacksService.findAll();
    }
    updateStatus(id, body) {
        return this.adminFeedbacksService.updateStatus(id, body.status, body.admin_reply);
    }
};
exports.AdminFeedbacksController = AdminFeedbacksController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminFeedbacksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AdminFeedbacksController.prototype, "updateStatus", null);
exports.AdminFeedbacksController = AdminFeedbacksController = __decorate([
    (0, common_1.Controller)('admin/feedbacks'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    __metadata("design:paramtypes", [admin_feedbacks_service_1.AdminFeedbacksService])
], AdminFeedbacksController);
//# sourceMappingURL=admin-feedbacks.controller.js.map