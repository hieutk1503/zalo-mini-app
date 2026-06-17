import { PrismaService } from '../prisma/prisma.service';
export declare class AdminFeedbacksService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        citizen: {
            full_name: string | null;
            phone: string | null;
            zalo_id: string;
        };
    } & {
        id: number;
        created_at: Date;
        content: string;
        status: string;
        citizen_id: number;
        image_urls: string | null;
        location: string | null;
        admin_reply: string | null;
    })[]>;
    updateStatus(id: number, status: string, adminReply?: string): Promise<{
        id: number;
        created_at: Date;
        content: string;
        status: string;
        citizen_id: number;
        image_urls: string | null;
        location: string | null;
        admin_reply: string | null;
    }>;
}
