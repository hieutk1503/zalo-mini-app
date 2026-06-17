import { PrismaService } from '../prisma/prisma.service';
type ImportRow = Record<string, unknown>;
export declare class ProceduresService {
    private prisma;
    constructor(prisma: PrismaService);
    private normalizeSearch;
    private getImportValue;
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
    findOne(id: number): import("@prisma/client").Prisma.Prisma__AdministrativeProcedureClient<{
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
    previewImport(buffer: Buffer): Promise<{
        newCount: number;
        conflictCount: number;
        conflicts: ImportRow[];
    }>;
    executeImport(buffer: Buffer, overwrite: boolean): Promise<{
        successCount: number;
    }>;
}
export {};
