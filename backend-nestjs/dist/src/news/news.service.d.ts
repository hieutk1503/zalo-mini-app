import { PrismaService } from '../prisma/prisma.service';
import { AiSyncService } from '../ai-sync/ai-sync.service';
export declare class NewsService {
    private prisma;
    private aiSyncService;
    constructor(prisma: PrismaService, aiSyncService: AiSyncService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        title: string;
        content: string;
        thumbnail: string | null;
        published_at: Date;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__NewsClient<{
        id: number;
        title: string;
        content: string;
        thumbnail: string | null;
        published_at: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(data: any): Promise<{
        id: number;
        title: string;
        content: string;
        thumbnail: string | null;
        published_at: Date;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        title: string;
        content: string;
        thumbnail: string | null;
        published_at: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        title: string;
        content: string;
        thumbnail: string | null;
        published_at: Date;
    }>;
}
