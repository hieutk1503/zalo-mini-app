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
exports.WorkScheduleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WorkScheduleService = class WorkScheduleService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createDto) {
        return this.prisma.workSchedule.create({ data: createDto });
    }
    findAll() {
        return this.prisma.workSchedule.findMany({ orderBy: { created_at: 'desc' } });
    }
    findOne(id) {
        return this.prisma.workSchedule.findUnique({ where: { id } });
    }
    update(id, updateDto) {
        return this.prisma.workSchedule.update({
            where: { id },
            data: updateDto,
        });
    }
    remove(id) {
        return this.prisma.workSchedule.delete({ where: { id } });
    }
};
exports.WorkScheduleService = WorkScheduleService;
exports.WorkScheduleService = WorkScheduleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkScheduleService);
//# sourceMappingURL=work-schedule.service.js.map