import { FormTemplateService } from './form-template.service';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
export declare class FormTemplateController {
    private readonly formTemplateService;
    constructor(formTemplateService: FormTemplateService);
    create(createFormTemplateDto: CreateFormTemplateDto): import("@prisma/client").Prisma.Prisma__FormTemplateClient<{
        id: number;
        created_at: Date;
        name: string;
        file_url: string;
        procedure_id: number | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        created_at: Date;
        name: string;
        file_url: string;
        procedure_id: number | null;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__FormTemplateClient<{
        id: number;
        created_at: Date;
        name: string;
        file_url: string;
        procedure_id: number | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateFormTemplateDto: UpdateFormTemplateDto): import("@prisma/client").Prisma.Prisma__FormTemplateClient<{
        id: number;
        created_at: Date;
        name: string;
        file_url: string;
        procedure_id: number | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__FormTemplateClient<{
        id: number;
        created_at: Date;
        name: string;
        file_url: string;
        procedure_id: number | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
