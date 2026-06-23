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
exports.HomeSectionsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HomeSectionsController = class HomeSectionsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getHomeSections() {
        const news = await this.prisma.news.findMany({
            take: 5,
            orderBy: { published_at: 'desc' }
        });
        return [
            { id: 'hs-hero', key: 'hero', order: 1, enabled: true, title: 'CHÍNH QUYỀN SỐ', color1: '#C8102E', color2: '#7A0C16' },
            { id: 'hs-stats', key: 'stats', order: 2, enabled: true, color1: '#C8102E', color2: '#A4161A' },
            { id: 'hs-statsdss', key: 'statsDss', order: 3, enabled: true },
            { id: 'hs-explore', key: 'explore', order: 4, enabled: true, title: 'Du lịch địa phương', data: [] },
            { id: 'hs-news', key: 'newsList', order: 5, enabled: true, title: 'Tin tức', data: news },
            { id: 'hs-events', key: 'events', order: 5.5, enabled: true, title: 'Sự kiện sắp diễn ra' },
            { id: 'hs-oa', key: 'oa', order: 6, enabled: true },
            { id: 'hs-citizen', key: 'citizenGrid', order: 7, enabled: true, title: 'Dành cho công dân' },
            { id: 'hs-khupho', key: 'khuphoGrid', order: 8, enabled: true, title: 'Quản lý khu phố' },
            { id: 'hs-business', key: 'businessGrid', order: 9, enabled: true, title: 'Dành cho doanh nghiệp, tổ chức' },
            { id: 'hs-featured', key: 'featured', order: 10, enabled: true, title: 'Tin tức Chuyển Đổi Số', subtitle: 'TIN NỔI BẬT' },
        ];
    }
};
exports.HomeSectionsController = HomeSectionsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HomeSectionsController.prototype, "getHomeSections", null);
exports.HomeSectionsController = HomeSectionsController = __decorate([
    (0, common_1.Controller)('home-sections'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HomeSectionsController);
//# sourceMappingURL=home-sections.controller.js.map