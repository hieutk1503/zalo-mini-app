import { BiddingService } from './bidding.service';
import { CreateBiddingDto } from './dto/create-bidding.dto';
import { UpdateBiddingDto } from './dto/update-bidding.dto';
export declare class BiddingController {
    private readonly biddingService;
    constructor(biddingService: BiddingService);
    create(createBiddingDto: CreateBiddingDto): import("@prisma/client").Prisma.Prisma__BiddingClient<{
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
    findOne(id: string): import("@prisma/client").Prisma.Prisma__BiddingClient<{
        id: number;
        created_at: Date;
        start_date: Date | null;
        end_date: Date | null;
        package_name: string;
        price: import("@prisma/client-runtime-utils").Decimal | null;
        requirements_file: string | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateBiddingDto: UpdateBiddingDto): import("@prisma/client").Prisma.Prisma__BiddingClient<{
        id: number;
        created_at: Date;
        start_date: Date | null;
        end_date: Date | null;
        package_name: string;
        price: import("@prisma/client-runtime-utils").Decimal | null;
        requirements_file: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__BiddingClient<{
        id: number;
        created_at: Date;
        start_date: Date | null;
        end_date: Date | null;
        package_name: string;
        price: import("@prisma/client-runtime-utils").Decimal | null;
        requirements_file: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
