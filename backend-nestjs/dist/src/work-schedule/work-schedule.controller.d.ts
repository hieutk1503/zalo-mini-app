import { WorkScheduleService } from './work-schedule.service';
import { CreateWorkScheduleDto } from './dto/create-work-schedule.dto';
import { UpdateWorkScheduleDto } from './dto/update-work-schedule.dto';
export declare class WorkScheduleController {
    private readonly workScheduleService;
    constructor(workScheduleService: WorkScheduleService);
    create(createWorkScheduleDto: CreateWorkScheduleDto): import("@prisma/client").Prisma.Prisma__WorkScheduleClient<{
        id: number;
        created_at: Date;
        title: string;
        location: string | null;
        event_date: Date;
        time: string | null;
        attendees: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        created_at: Date;
        title: string;
        location: string | null;
        event_date: Date;
        time: string | null;
        attendees: string | null;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__WorkScheduleClient<{
        id: number;
        created_at: Date;
        title: string;
        location: string | null;
        event_date: Date;
        time: string | null;
        attendees: string | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateWorkScheduleDto: UpdateWorkScheduleDto): import("@prisma/client").Prisma.Prisma__WorkScheduleClient<{
        id: number;
        created_at: Date;
        title: string;
        location: string | null;
        event_date: Date;
        time: string | null;
        attendees: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__WorkScheduleClient<{
        id: number;
        created_at: Date;
        title: string;
        location: string | null;
        event_date: Date;
        time: string | null;
        attendees: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
