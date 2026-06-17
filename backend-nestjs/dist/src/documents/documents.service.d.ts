import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class DocumentsService {
    private prisma;
    constructor(prisma: PrismaService);
    private normalizeSearch;
    findAll(type?: string, q?: string): Promise<{
        id: number;
        created_at: Date;
        type: string;
        document_no: string;
        abstract: string;
        file_url: string;
    }[]>;
    findOne(id: number): Prisma.Prisma__DocumentClient<{
        id: number;
        created_at: Date;
        type: string;
        document_no: string;
        abstract: string;
        file_url: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
}
