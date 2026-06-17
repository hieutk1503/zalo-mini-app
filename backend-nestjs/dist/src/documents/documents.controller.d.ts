import { DocumentsService } from './documents.service';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    findAll(type?: string, q?: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        created_at: Date;
        type: string;
        abstract: string;
        document_no: string;
        file_url: string;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__DocumentClient<{
        id: number;
        created_at: Date;
        type: string;
        abstract: string;
        document_no: string;
        file_url: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
