import { PrismaService } from '../prisma/prisma.service';
export declare class FormTemplateService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: any): import("@prisma/client").Prisma.Prisma__FormTemplateClient<{
        id: number;
        created_at: Date;
        name: string;
        file_url: string;
        procedure_id: number | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        created_at: Date;
        name: string;
        file_url: string;
        procedure_id: number | null;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__FormTemplateClient<{
        id: number;
        created_at: Date;
        name: string;
        file_url: string;
        procedure_id: number | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateDto: any): import("@prisma/client").Prisma.Prisma__FormTemplateClient<{
        id: number;
        created_at: Date;
        name: string;
        file_url: string;
        procedure_id: number | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__FormTemplateClient<{
        id: number;
        created_at: Date;
        name: string;
        file_url: string;
        procedure_id: number | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
