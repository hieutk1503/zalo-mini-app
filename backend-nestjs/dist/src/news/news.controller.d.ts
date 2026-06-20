import { NewsService } from './news.service';
export declare class NewsController {
    private readonly newsService;
    constructor(newsService: NewsService);
    create(createData: any): import("@prisma/client").Prisma.Prisma__NewsClient<{
        id: number;
        title: string;
        content: string;
        thumbnail: string | null;
        published_at: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        title: string;
        content: string;
        thumbnail: string | null;
        published_at: Date;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__NewsClient<{
        id: number;
        title: string;
        content: string;
        thumbnail: string | null;
        published_at: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateData: any): import("@prisma/client").Prisma.Prisma__NewsClient<{
        id: number;
        title: string;
        content: string;
        thumbnail: string | null;
        published_at: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__NewsClient<{
        id: number;
        title: string;
        content: string;
        thumbnail: string | null;
        published_at: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
