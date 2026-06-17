"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProceduresService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const xlsx = __importStar(require("xlsx"));
let ProceduresService = class ProceduresService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(q) {
        if (!q) {
            return this.prisma.administrativeProcedure.findMany({
                orderBy: { title: 'asc' },
            });
        }
        return this.prisma.administrativeProcedure.findMany({
            where: {
                title: { contains: q, mode: 'insensitive' },
            },
            orderBy: { title: 'asc' },
        });
    }
    findOne(id) {
        return this.prisma.administrativeProcedure.findUnique({ where: { id } });
    }
    async previewImport(buffer) {
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);
        const existingCodes = (await this.prisma.administrativeProcedure.findMany({ select: { code: true } })).map(p => p.code);
        const conflicts = data.filter((row) => existingCodes.includes(row['Mã thủ tục']?.toString()?.trim()));
        const newRecords = data.filter((row) => row['Mã thủ tục'] && !existingCodes.includes(row['Mã thủ tục']?.toString()?.trim()));
        return { newCount: newRecords.length, conflictCount: conflicts.length, conflicts };
    }
    async executeImport(buffer, overwrite) {
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);
        let successCount = 0;
        for (const row of data) {
            const rawCode = row['Mã thủ tục']?.toString()?.trim();
            if (!rawCode)
                continue;
            const payload = {
                title: row['Tên thủ tục']?.toString() || '',
                description: row['Mô tả']?.toString() || '',
                fee: row['Lệ phí']?.toString() || '',
                duration: row['Thời gian']?.toString() || '',
                process_steps: row['Các bước']?.toString() || '',
                is_active: true
            };
            if (overwrite) {
                await this.prisma.administrativeProcedure.upsert({
                    where: { code: rawCode },
                    update: payload,
                    create: { code: rawCode, ...payload }
                });
                successCount++;
            }
            else {
                const exists = await this.prisma.administrativeProcedure.findUnique({ where: { code: rawCode } });
                if (!exists) {
                    await this.prisma.administrativeProcedure.create({ data: { code: rawCode, ...payload } });
                    successCount++;
                }
            }
        }
        return { successCount };
    }
};
exports.ProceduresService = ProceduresService;
exports.ProceduresService = ProceduresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProceduresService);
//# sourceMappingURL=procedures.service.js.map