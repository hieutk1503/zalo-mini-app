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
exports.SoftAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const zalo_auth_service_1 = require("./zalo-auth.service");
const env_1 = require("../config/env");
let SoftAuthGuard = class SoftAuthGuard {
    prisma;
    zaloAuthService;
    constructor(prisma, zaloAuthService) {
        this.prisma = prisma;
        this.zaloAuthService = zaloAuthService;
    }
    async canActivate(context) {
        const request = context
            .switchToHttp()
            .getRequest();
        const accessToken = request.headers['x-zalo-access-token'] ||
            request.headers.authorization?.replace('Bearer ', '');
        if (accessToken && this.zaloAuthService.isConfigured()) {
            const profile = await this.zaloAuthService.verifyAccessToken(accessToken);
            const citizen = await this.upsertCitizen(profile.id, profile.name?.trim() || 'Công dân Zalo', undefined, profile.picture?.data?.url);
            request.user = citizen;
            return true;
        }
        if ((0, env_1.allowDevHeaderAuth)()) {
            return this.authenticateWithDevHeaders(request);
        }
        throw new common_1.UnauthorizedException('Thiếu access token Zalo hoặc thông tin xác thực hợp lệ');
    }
    async authenticateWithDevHeaders(request) {
        const zaloId = request.headers['x-zalo-id'];
        const fullNameRaw = request.headers['x-full-name'] || 'Công dân';
        const fullName = decodeURIComponent(fullNameRaw);
        const phone = request.headers['x-phone'] || '';
        if (!zaloId) {
            throw new common_1.UnauthorizedException('Thiếu zalo_id để xác thực');
        }
        const citizen = await this.upsertCitizen(zaloId, fullName, phone);
        request.user = citizen;
        return true;
    }
    async upsertCitizen(zaloId, fullName, phone, avatarUrl) {
        let citizen = await this.prisma.citizen.findUnique({
            where: { zalo_id: zaloId },
        });
        if (!citizen) {
            citizen = await this.prisma.citizen.create({
                data: {
                    zalo_id: zaloId,
                    full_name: fullName,
                    phone: phone || null,
                    avatar_url: avatarUrl || null,
                },
            });
            return citizen;
        }
        const updates = {};
        if (fullName && fullName !== citizen.full_name)
            updates.full_name = fullName;
        if (phone && phone !== citizen.phone)
            updates.phone = phone;
        if (avatarUrl && avatarUrl !== citizen.avatar_url) {
            updates.avatar_url = avatarUrl;
        }
        if (Object.keys(updates).length === 0)
            return citizen;
        return this.prisma.citizen.update({
            where: { id: citizen.id },
            data: updates,
        });
    }
};
exports.SoftAuthGuard = SoftAuthGuard;
exports.SoftAuthGuard = SoftAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        zalo_auth_service_1.ZaloAuthService])
], SoftAuthGuard);
//# sourceMappingURL=soft-auth.guard.js.map