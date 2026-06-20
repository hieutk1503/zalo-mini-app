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
const PROCEDURE_IMPORT_HEADERS = {
    code: ['Mã thủ tục', 'MÃ£ thá»§ tá»¥c'],
    title: ['Tên thủ tục', 'TÃªn thá»§ tá»¥c'],
    description: ['Mô tả', 'MÃ´ táº£'],
    fee: ['Lệ phí', 'Lá»‡ phÃ­'],
    duration: ['Thời gian', 'Thá»i gian'],
    processSteps: ['Các bước', 'CÃ¡c bÆ°á»›c'],
};
let ProceduresService = class ProceduresService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    normalizeSearch(value) {
        return (value || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\u0111/g, 'd')
            .replace(/\u0110/g, 'D')
            .toLowerCase();
    }
    getImportValue(row, headers) {
        for (const header of headers) {
            const value = row[header];
            if (value !== undefined && value !== null) {
                return value.toString().trim();
            }
        }
        return '';
    }
    async findAll(q) {
        const procedures = await this.prisma.administrativeProcedure.findMany({
            where: { is_active: true },
            orderBy: { title: 'asc' },
        });
        if (!q)
            return procedures;
        const normalizedQuery = this.normalizeSearch(q);
        return procedures.filter((procedure) => this.normalizeSearch([
            procedure.code,
            procedure.title,
            procedure.description,
            procedure.fee,
            procedure.duration,
            procedure.process_steps,
        ].join(' ')).includes(normalizedQuery));
    }
    findOne(id) {
        return this.prisma.administrativeProcedure.findUnique({
            where: { id },
        });
    }
    create(data) {
        return this.prisma.administrativeProcedure.create({
            data,
        });
    }
    update(id, data) {
        return this.prisma.administrativeProcedure.update({
            where: { id },
            data,
        });
    }
    remove(id) {
        return this.prisma.administrativeProcedure.delete({
            where: { id },
        });
    }
    async previewImport(buffer) {
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);
        const existingCodes = (await this.prisma.administrativeProcedure.findMany({
            select: { code: true },
        })).map((procedure) => procedure.code);
        const conflicts = data.filter((row) => existingCodes.includes(this.getImportValue(row, PROCEDURE_IMPORT_HEADERS.code)));
        const newRecords = data.filter((row) => {
            const code = this.getImportValue(row, PROCEDURE_IMPORT_HEADERS.code);
            return code && !existingCodes.includes(code);
        });
        return {
            newCount: newRecords.length,
            conflictCount: conflicts.length,
            conflicts,
        };
    }
    async executeImport(buffer, overwrite) {
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);
        let successCount = 0;
        for (const row of data) {
            const rawCode = this.getImportValue(row, PROCEDURE_IMPORT_HEADERS.code);
            if (!rawCode)
                continue;
            const payload = {
                title: this.getImportValue(row, PROCEDURE_IMPORT_HEADERS.title),
                description: this.getImportValue(row, PROCEDURE_IMPORT_HEADERS.description),
                fee: this.getImportValue(row, PROCEDURE_IMPORT_HEADERS.fee),
                duration: this.getImportValue(row, PROCEDURE_IMPORT_HEADERS.duration),
                process_steps: this.getImportValue(row, PROCEDURE_IMPORT_HEADERS.processSteps),
                is_active: true,
            };
            if (overwrite) {
                await this.prisma.administrativeProcedure.upsert({
                    where: { code: rawCode },
                    update: payload,
                    create: { code: rawCode, ...payload },
                });
                successCount++;
            }
            else {
                const exists = await this.prisma.administrativeProcedure.findUnique({
                    where: { code: rawCode },
                });
                if (!exists) {
                    await this.prisma.administrativeProcedure.create({
                        data: { code: rawCode, ...payload },
                    });
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