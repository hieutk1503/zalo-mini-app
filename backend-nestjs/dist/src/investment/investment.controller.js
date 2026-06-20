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
exports.InvestmentController = void 0;
const common_1 = require("@nestjs/common");
const admin_auth_guard_1 = require("../admin-auth/admin-auth.guard");
const investment_service_1 = require("./investment.service");
const create_investment_dto_1 = require("./dto/create-investment.dto");
const update_investment_dto_1 = require("./dto/update-investment.dto");
let InvestmentController = class InvestmentController {
    investmentService;
    constructor(investmentService) {
        this.investmentService = investmentService;
    }
    create(createInvestmentDto) {
        return this.investmentService.create(createInvestmentDto);
    }
    findAll() {
        return this.investmentService.findAll();
    }
    findOne(id) {
        return this.investmentService.findOne(+id);
    }
    update(id, updateInvestmentDto) {
        return this.investmentService.update(+id, updateInvestmentDto);
    }
    remove(id) {
        return this.investmentService.remove(+id);
    }
};
exports.InvestmentController = InvestmentController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_investment_dto_1.CreateInvestmentDto]),
    __metadata("design:returntype", void 0)
], InvestmentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InvestmentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvestmentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_investment_dto_1.UpdateInvestmentDto]),
    __metadata("design:returntype", void 0)
], InvestmentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvestmentController.prototype, "remove", null);
exports.InvestmentController = InvestmentController = __decorate([
    (0, common_1.Controller)('investment'),
    __metadata("design:paramtypes", [investment_service_1.InvestmentService])
], InvestmentController);
//# sourceMappingURL=investment.controller.js.map