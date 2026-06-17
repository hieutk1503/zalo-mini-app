import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class DocumentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(type?: string, q?: string): Prisma.PrismaPromise<{
        id: number;
        created_at: Date;
        abstract: string;
        document_no: string;
        file_url: string;
        type: string;
    }[]>;
    findOne(id: number): Prisma.Prisma__DocumentClient<{
        id: number;
        created_at: Date;
        abstract: string;
        document_no: string;
        file_url: string;
        type: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
}
