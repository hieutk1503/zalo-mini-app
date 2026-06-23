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
exports.StaticDataController = void 0;
const common_1 = require("@nestjs/common");
let StaticDataController = class StaticDataController {
    getHotlines() {
        return [
            { name: "UBND xã", phone: "02623.xxx.xxx", description: "Đường dây nóng" },
            { name: "Công an xã", phone: "113", description: "An ninh trật tự" },
            { name: "Y tế xã", phone: "115", description: "Cấp cứu y tế" },
        ];
    }
    getLocations() {
        return [
            { name: "UBND xã Nghĩa Trụ", lat: 20.85, lng: 106.05, address: "Xã Nghĩa Trụ, Văn Giang, Hưng Yên" },
        ];
    }
    getFeedbackTypes() {
        return [
            { id: 1, name: "Phản ánh môi trường" },
            { id: 2, name: "Phản ánh hạ tầng" },
            { id: 3, name: "Phản ánh an ninh trật tự" },
            { id: 4, name: "Góp ý, kiến nghị" },
        ];
    }
    search() {
        return { results: [] };
    }
};
exports.StaticDataController = StaticDataController;
__decorate([
    (0, common_1.Get)('hotlines'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StaticDataController.prototype, "getHotlines", null);
__decorate([
    (0, common_1.Get)('locations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StaticDataController.prototype, "getLocations", null);
__decorate([
    (0, common_1.Get)('feedbacks/types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StaticDataController.prototype, "getFeedbackTypes", null);
__decorate([
    (0, common_1.Get)('search'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StaticDataController.prototype, "search", null);
exports.StaticDataController = StaticDataController = __decorate([
    (0, common_1.Controller)()
], StaticDataController);
//# sourceMappingURL=static-data.controller.js.map