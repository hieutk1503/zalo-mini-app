import { PrismaService } from '../prisma/prisma.service';
export declare class InvestmentService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: any): import("@prisma/client").Prisma.Prisma__InvestmentProjectClient<{
        id: number;
        description: string;
        created_at: Date;
        status: string;
        project_name: string;
        start_date: Date | null;
        end_date: Date | null;
        budget: import("@prisma/client-runtime-utils").Decimal | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        description: string;
        created_at: Date;
        status: string;
        project_name: string;
        start_date: Date | null;
        end_date: Date | null;
        budget: import("@prisma/client-runtime-utils").Decimal | null;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__InvestmentProjectClient<{
        id: number;
        description: string;
        created_at: Date;
        status: string;
        project_name: string;
        start_date: Date | null;
        end_date: Date | null;
        budget: import("@prisma/client-runtime-utils").Decimal | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateDto: any): import("@prisma/client").Prisma.Prisma__InvestmentProjectClient<{
        id: number;
        description: string;
        created_at: Date;
        status: string;
        project_name: string;
        start_date: Date | null;
        end_date: Date | null;
        budget: import("@prisma/client-runtime-utils").Decimal | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__InvestmentProjectClient<{
        id: number;
        description: string;
        created_at: Date;
        status: string;
        project_name: string;
        start_date: Date | null;
        end_date: Date | null;
        budget: import("@prisma/client-runtime-utils").Decimal | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
