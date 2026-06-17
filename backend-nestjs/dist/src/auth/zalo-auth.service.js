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
exports.ZaloAuthService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const crypto_1 = require("crypto");
const rxjs_1 = require("rxjs");
const env_1 = require("../config/env");
let ZaloAuthService = class ZaloAuthService {
    httpService;
    constructor(httpService) {
        this.httpService = httpService;
    }
    isConfigured() {
        return (0, env_1.isZaloAuthConfigured)();
    }
    createAppSecretProof(accessToken) {
        return (0, crypto_1.createHmac)('sha256', env_1.env.zaloAppSecret)
            .update(accessToken)
            .digest('hex');
    }
    async verifyAccessToken(accessToken) {
        if (!(0, env_1.isZaloAuthConfigured)()) {
            throw new common_1.UnauthorizedException('Zalo auth chưa được cấu hình trên server');
        }
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('https://graph.zalo.me/v2.0/me', {
                params: { fields: 'id,name,picture' },
                headers: {
                    access_token: accessToken,
                    appsecret_proof: this.createAppSecretProof(accessToken),
                },
            }));
            if (!response.data?.id) {
                throw new common_1.UnauthorizedException('Access token Zalo không hợp lệ');
            }
            return response.data;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            throw new common_1.UnauthorizedException('Không thể xác thực tài khoản Zalo');
        }
    }
};
exports.ZaloAuthService = ZaloAuthService;
exports.ZaloAuthService = ZaloAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], ZaloAuthService);
//# sourceMappingURL=zalo-auth.service.js.map