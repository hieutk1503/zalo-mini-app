"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZaloAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const env_1 = require("../config/env");
let ZaloAuthGuard = class ZaloAuthGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.replace('Bearer ', '');
        if (!token && (0, env_1.allowDevHeaderAuth)()) {
            return true;
        }
        return !!token;
    }
};
exports.ZaloAuthGuard = ZaloAuthGuard;
exports.ZaloAuthGuard = ZaloAuthGuard = __decorate([
    (0, common_1.Injectable)()
], ZaloAuthGuard);
//# sourceMappingURL=zalo-auth.guard.js.map