import { PrismaService } from '../prisma/prisma.service';
export declare class PlanningService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: any): import("@prisma/client").Prisma.Prisma__PlanningClient<{
        id: number;
        title: string;
        created_at: Date;
        content: string;
        file_url: string | null;
        image: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        title: string;
        created_at: Date;
        content: string;
        file_url: string | null;
        image: string | null;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__PlanningClient<{
        id: number;
        title: string;
        created_at: Date;
        content: string;
        file_url: string | null;
        image: string | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateDto: any): import("@prisma/client").Prisma.Prisma__PlanningClient<{
        id: number;
        title: string;
        created_at: Date;
        content: string;
        file_url: string | null;
        image: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__PlanningClient<{
        id: number;
        title: string;
        created_at: Date;
        content: string;
        file_url: string | null;
        image: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
