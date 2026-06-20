import { PrismaService } from '../prisma/prisma.service';
export declare class BiddingService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: any): import("@prisma/client").Prisma.Prisma__BiddingClient<{
        id: number;
        created_at: Date;
        start_date: Date | null;
        end_date: Date | null;
        package_name: string;
        price: import("@prisma/client-runtime-utils").Decimal | null;
        requirements_file: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        created_at: Date;
        start_date: Date | null;
        end_date: Date | null;
        package_name: string;
        price: import("@prisma/client-runtime-utils").Decimal | null;
        requirements_file: string | null;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__BiddingClient<{
        id: number;
        created_at: Date;
        start_date: Date | null;
        end_date: Date | null;
        package_name: string;
        price: import("@prisma/client-runtime-utils").Decimal | null;
        requirements_file: string | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateDto: any): import("@prisma/client").Prisma.Prisma__BiddingClient<{
        id: number;
        created_at: Date;
        start_date: Date | null;
        end_date: Date | null;
        package_name: string;
        price: import("@prisma/client-runtime-utils").Decimal | null;
        requirements_file: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__BiddingClient<{
        id: number;
        created_at: Date;
        start_date: Date | null;
        end_date: Date | null;
        package_name: string;
        price: import("@prisma/client-runtime-utils").Decimal | null;
        requirements_file: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
