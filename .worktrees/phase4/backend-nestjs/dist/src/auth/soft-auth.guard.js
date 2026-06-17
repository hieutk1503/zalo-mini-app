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
let SoftAuthGuard = class SoftAuthGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context
            .switchToHttp()
            .getRequest();
        const zaloId = request.headers['x-zalo-id'];
        const fullName = request.headers['x-full-name'] || 'Công dân';
        const phone = request.headers['x-phone'] || '';
        if (!zaloId) {
            throw new common_1.UnauthorizedException('Thiếu zalo_id để xác thực');
        }
        let citizen = await this.prisma.citizen.findUnique({
            where: { zalo_id: zaloId },
        });
        if (!citizen) {
            citizen = await this.prisma.citizen.create({
                data: {
                    zalo_id: zaloId,
                    full_name: fullName,
                    phone: phone,
                },
            });
        }
        request.user = citizen;
        return true;
    }
};
exports.SoftAuthGuard = SoftAuthGuard;
exports.SoftAuthGuard = SoftAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SoftAuthGuard);
//# sourceMappingURL=soft-auth.guard.js.map