import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
export declare class SurveyController {
    private readonly surveyService;
    constructor(surveyService: SurveyService);
    create(createSurveyDto: CreateSurveyDto): import("@prisma/client").Prisma.Prisma__SurveyClient<{
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
    findOne(id: string): import("@prisma/client").Prisma.Prisma__SurveyClient<{
        id: number;
        created_at: Date;
        rating: number;
        comment: string | null;
        user_zalo_id: string | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateSurveyDto: UpdateSurveyDto): import("@prisma/client").Prisma.Prisma__SurveyClient<{
        id: number;
        created_at: Date;
        rating: number;
        comment: string | null;
        user_zalo_id: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__SurveyClient<{
        id: number;
        created_at: Date;
        rating: number;
        comment: string | null;
        user_zalo_id: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
