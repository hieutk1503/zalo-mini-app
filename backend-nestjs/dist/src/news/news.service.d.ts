import { PrismaService } from '../prisma/prisma.service';
export declare class NewsService {
    private prisma;
    constructor(prisma: PrismaService);
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
}
