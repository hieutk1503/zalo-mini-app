import { ProceduresService } from './procedures.service';
export declare class ProceduresController {
    private readonly proceduresService;
    constructor(proceduresService: ProceduresService);
    findAll(q?: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        code: string;
        title: string;
        description: string | null;
        fee: string | null;
        duration: string | null;
        process_steps: string | null;
        is_active: boolean;
        created_at: Date;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__AdministrativeProcedureClient<{
        id: number;
        code: string;
        title: string;
        description: string | null;
        fee: string | null;
        duration: string | null;
        process_steps: string | null;
        is_active: boolean;
        created_at: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
