import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
export declare class AiSyncService {
    private readonly prisma;
    private readonly httpService;
    private readonly logger;
    private readonly AI_SERVICE_URL;
    constructor(prisma: PrismaService, httpService: HttpService);
    syncAllKnowledge(): Promise<{
        status: string;
        message: string;
    }>;
    private sendToAi;
}
