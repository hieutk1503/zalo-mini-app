import { InvestmentService } from './investment.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
export declare class InvestmentController {
    private readonly investmentService;
    constructor(investmentService: InvestmentService);
    create(createInvestmentDto: CreateInvestmentDto): import("@prisma/client").Prisma.Prisma__InvestmentProjectClient<{
        id: number;
        created_at: Date;
        description: string;
        status: string;
        project_name: string;
        start_date: Date | null;
        end_date: Date | null;
        budget: import("@prisma/client-runtime-utils").Decimal | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        created_at: Date;
        description: string;
        status: string;
        project_name: string;
        start_date: Date | null;
        end_date: Date | null;
        budget: import("@prisma/client-runtime-utils").Decimal | null;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__InvestmentProjectClient<{
        id: number;
        created_at: Date;
        description: string;
        status: string;
        project_name: string;
        start_date: Date | null;
        end_date: Date | null;
        budget: import("@prisma/client-runtime-utils").Decimal | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateInvestmentDto: UpdateInvestmentDto): import("@prisma/client").Prisma.Prisma__InvestmentProjectClient<{
        id: number;
        created_at: Date;
        description: string;
        status: string;
        project_name: string;
        start_date: Date | null;
        end_date: Date | null;
        budget: import("@prisma/client-runtime-utils").Decimal | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__InvestmentProjectClient<{
        id: number;
        created_at: Date;
        description: string;
        status: string;
        project_name: string;
        start_date: Date | null;
        end_date: Date | null;
        budget: import("@prisma/client-runtime-utils").Decimal | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
