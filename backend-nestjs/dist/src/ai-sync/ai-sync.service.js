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
var AiSyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiSyncService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const env_1 = require("../config/env");
let AiSyncService = AiSyncService_1 = class AiSyncService {
    prisma;
    httpService;
    logger = new common_1.Logger(AiSyncService_1.name);
    AI_SERVICE_URL = env_1.env.aiServiceUrl;
    constructor(prisma, httpService) {
        this.prisma = prisma;
        this.httpService = httpService;
    }
    async syncAllKnowledge() {
        this.logger.log('Bắt đầu đồng bộ dữ liệu sang AI Service...');
        try {
            await (0, rxjs_1.lastValueFrom)(this.httpService.delete(`${this.AI_SERVICE_URL}/api/embeddings/clear`));
            this.logger.log('Đã xóa dữ liệu vector cũ trên AI Service');
        }
        catch (error) {
            this.logger.error('Lỗi khi xóa vector cũ', error);
            throw error;
        }
        const procedures = await this.prisma.administrativeProcedure.findMany({
            where: { is_active: true },
        });
        for (const proc of procedures) {
            const chunk = `[Thủ tục: ${proc.code}] ${proc.title} - ${proc.description || ''} - Lệ phí: ${proc.fee || 'Không'} - Thời gian: ${proc.duration || 'Không'}`;
            await this.sendToAi('PROCEDURE', proc.id, chunk);
        }
        const news = await this.prisma.news.findMany();
        for (const item of news) {
            const chunk = `[Tin tức: ${item.title}] Nội dung: ${item.content}`;
            await this.sendToAi('NEWS', item.id, chunk);
        }
        const docs = await this.prisma.document.findMany();
        for (const doc of docs) {
            const chunk = `[Văn bản: ${doc.document_no}] Trích yếu: ${doc.abstract}`;
            await this.sendToAi('DOCUMENT', doc.id, chunk);
        }
        this.logger.log('Hoàn thành đồng bộ toàn bộ dữ liệu.');
        return { status: 'success', message: 'Sync completed successfully' };
    }
    async sendToAi(sourceType, sourceId, contentChunk) {
        try {
            await (0, rxjs_1.lastValueFrom)(this.httpService.post(`${this.AI_SERVICE_URL}/api/embeddings/sync`, {
                source_type: sourceType,
                source_id: sourceId,
                content_chunk: contentChunk,
            }));
            this.logger.debug(`Synced ${sourceType} ID ${sourceId}`);
        }
        catch (error) {
            this.logger.error(`Lỗi khi sync ${sourceType} ID ${sourceId}`, error);
        }
    }
};
exports.AiSyncService = AiSyncService;
exports.AiSyncService = AiSyncService = AiSyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        axios_1.HttpService])
], AiSyncService);
//# sourceMappingURL=ai-sync.service.js.map