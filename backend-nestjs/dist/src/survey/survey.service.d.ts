import { PrismaService } from '../prisma/prisma.service';
export declare class SurveyService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: any): import("@prisma/client").Prisma.Prisma__SurveyClient<{
        id: number;
        created_at: Date;
        rating: number;
        comment: string | null;
        user_zalo_id: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        created_at: Date;
        rating: number;
        comment: string | null;
        user_zalo_id: string | null;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__SurveyClient<{
        id: number;
        created_at: Date;
        rating: number;
        comment: string | null;
        user_zalo_id: string | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateDto: any): import("@prisma/client").Prisma.Prisma__SurveyClient<{
        id: number;
        created_at: Date;
        rating: number;
        comment: string | null;
        user_zalo_id: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__SurveyClient<{
        id: number;
        created_at: Date;
        rating: number;
        comment: string | null;
        user_zalo_id: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
