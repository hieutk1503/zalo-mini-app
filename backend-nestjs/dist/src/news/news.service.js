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
exports.NewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_sync_service_1 = require("../ai-sync/ai-sync.service");
let NewsService = class NewsService {
    prisma;
    aiSyncService;
    constructor(prisma, aiSyncService) {
        this.prisma = prisma;
        this.aiSyncService = aiSyncService;
    }
    findAll() {
        return this.prisma.news.findMany({
            orderBy: { published_at: 'desc' },
            take: 20,
        });
    }
    findOne(id) {
        return this.prisma.news.findUnique({
            where: { id },
        });
    }
    async create(data) {
        const news = await this.prisma.news.create({
            data: {
                title: data.title,
                content: data.content,
                thumbnail: data.thumbnail,
            },
        });
        const chunk = `[Tin tức: ${news.title}] Nội dung: ${news.content}`;
        this.aiSyncService.syncItem('NEWS', news.id, chunk);
        return news;
    }
    async update(id, data) {
        const news = await this.prisma.news.update({
            where: { id },
            data: {
                title: data.title,
                content: data.content,
                thumbnail: data.thumbnail,
            },
        });
        const chunk = `[Tin tức: ${news.title}] Nội dung: ${news.content}`;
        this.aiSyncService.syncItem('NEWS', news.id, chunk);
        return news;
    }
    async remove(id) {
        const news = await this.prisma.news.delete({
            where: { id },
        });
        this.aiSyncService.deleteItem('NEWS', id);
        return news;
    }
};
exports.NewsService = NewsService;
exports.NewsService = NewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_sync_service_1.AiSyncService])
], NewsService);
//# sourceMappingURL=news.service.js.map