import { DocumentsService } from './documents.service';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    create(createData: any): import("@prisma/client").Prisma.Prisma__DocumentClient<{
        id: number;
        created_at: Date;
        type: string;
        document_no: string;
        abstract: string;
        file_url: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(type?: string, q?: string): Promise<{
        id: number;
        created_at: Date;
        type: string;
        document_no: string;
        abstract: string;
        file_url: string;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__DocumentClient<{
        id: number;
        created_at: Date;
        type: string;
        document_no: string;
        abstract: string;
        file_url: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateData: any): import("@prisma/client").Prisma.Prisma__DocumentClient<{
        id: number;
        created_at: Date;
        type: string;
        document_no: string;
        abstract: string;
        file_url: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__DocumentClient<{
        id: number;
        created_at: Date;
        type: string;
        document_no: string;
        abstract: string;
        file_url: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
