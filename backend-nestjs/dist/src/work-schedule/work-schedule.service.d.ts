import { PrismaService } from '../prisma/prisma.service';
export declare class WorkScheduleService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: any): import("@prisma/client").Prisma.Prisma__WorkScheduleClient<{
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
    findOne(id: number): import("@prisma/client").Prisma.Prisma__WorkScheduleClient<{
        id: number;
        created_at: Date;
        title: string;
        location: string | null;
        event_date: Date;
        time: string | null;
        attendees: string | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateDto: any): import("@prisma/client").Prisma.Prisma__WorkScheduleClient<{
        id: number;
        created_at: Date;
        title: string;
        location: string | null;
        event_date: Date;
        time: string | null;
        attendees: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__WorkScheduleClient<{
        id: number;
        created_at: Date;
        title: string;
        location: string | null;
        event_date: Date;
        time: string | null;
        attendees: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
