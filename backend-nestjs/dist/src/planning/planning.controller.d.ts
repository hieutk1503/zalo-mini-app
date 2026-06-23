import { PlanningService } from './planning.service';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { UpdatePlanningDto } from './dto/update-planning.dto';
export declare class PlanningController {
    private readonly planningService;
    constructor(planningService: PlanningService);
    create(createPlanningDto: CreatePlanningDto): import("@prisma/client").Prisma.Prisma__PlanningClient<{
        id: number;
        title: string;
        created_at: Date;
        content: string;
        file_url: string | null;
        image: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        title: string;
        created_at: Date;
        content: string;
        file_url: string | null;
        image: string | null;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__PlanningClient<{
        id: number;
        title: string;
        created_at: Date;
        content: string;
        file_url: string | null;
        image: string | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updatePlanningDto: UpdatePlanningDto): import("@prisma/client").Prisma.Prisma__PlanningClient<{
        id: number;
        title: string;
        created_at: Date;
        content: string;
        file_url: string | null;
        image: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__PlanningClient<{
        id: number;
        title: string;
        created_at: Date;
        content: string;
        file_url: string | null;
        image: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
