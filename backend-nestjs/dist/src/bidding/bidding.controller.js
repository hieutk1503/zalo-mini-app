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
exports.BiddingController = void 0;
const common_1 = require("@nestjs/common");
const admin_auth_guard_1 = require("../admin-auth/admin-auth.guard");
const bidding_service_1 = require("./bidding.service");
const create_bidding_dto_1 = require("./dto/create-bidding.dto");
const update_bidding_dto_1 = require("./dto/update-bidding.dto");
let BiddingController = class BiddingController {
    biddingService;
    constructor(biddingService) {
        this.biddingService = biddingService;
    }
    create(createBiddingDto) {
        return this.biddingService.create(createBiddingDto);
    }
    findAll() {
        return this.biddingService.findAll();
    }
    findOne(id) {
        return this.biddingService.findOne(+id);
    }
    update(id, updateBiddingDto) {
        return this.biddingService.update(+id, updateBiddingDto);
    }
    remove(id) {
        return this.biddingService.remove(+id);
    }
};
exports.BiddingController = BiddingController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bidding_dto_1.CreateBiddingDto]),
    __metadata("design:returntype", void 0)
], BiddingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BiddingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BiddingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_bidding_dto_1.UpdateBiddingDto]),
    __metadata("design:returntype", void 0)
], BiddingController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BiddingController.prototype, "remove", null);
exports.BiddingController = BiddingController = __decorate([
    (0, common_1.Controller)('bidding'),
    __metadata("design:paramtypes", [bidding_service_1.BiddingService])
], BiddingController);
//# sourceMappingURL=bidding.controller.js.map