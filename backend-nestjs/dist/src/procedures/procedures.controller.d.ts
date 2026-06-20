import { ProceduresService } from './procedures.service';
export declare class ProceduresController {
    private readonly proceduresService;
    constructor(proceduresService: ProceduresService);
    findAll(q?: string): Promise<{
        id: number;
        created_at: Date;
        code: string;
        title: string;
        description: string | null;
        fee: string | null;
        duration: string | null;
        process_steps: string | null;
        is_active: boolean;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__AdministrativeProcedureClient<{
        id: number;
        created_at: Date;
        code: string;
        title: string;
        description: string | null;
        fee: string | null;
        duration: string | null;
        process_steps: string | null;
        is_active: boolean;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(data: any): import("@prisma/client").Prisma.Prisma__AdministrativeProcedureClient<{
        id: number;
        created_at: Date;
        code: string;
        title: string;
        description: string | null;
        fee: string | null;
        duration: string | null;
        process_steps: string | null;
        is_active: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: any): import("@prisma/client").Prisma.Prisma__AdministrativeProcedureClient<{
        id: number;
        created_at: Date;
        code: string;
        title: string;
        description: string | null;
        fee: string | null;
        duration: string | null;
        process_steps: string | null;
        is_active: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__AdministrativeProcedureClient<{
        id: number;
        created_at: Date;
        code: string;
        title: string;
        description: string | null;
        fee: string | null;
        duration: string | null;
        process_steps: string | null;
        is_active: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    previewImport(file: Express.Multer.File): Promise<{
        newCount: number;
        conflictCount: number;
        conflicts: {
            [x: string]: unknown;
        }[];
    }>;
    executeImport(file: Express.Multer.File, overwriteStr: string): Promise<{
        successCount: number;
    }>;
}
