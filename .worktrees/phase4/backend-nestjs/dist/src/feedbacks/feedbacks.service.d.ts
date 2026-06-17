import { PrismaService } from '../prisma/prisma.service';
export declare class FeedbacksService {
    private prisma;
    constructor(prisma: PrismaService);
    createFeedback(citizenId: number, data: {
        content: string;
        imageUrls?: string;
    }): Promise<{
        id: number;
        created_at: Date;
        content: string;
        status: string;
        citizen_id: number;
        image_urls: string | null;
        admin_reply: string | null;
    }>;
    getMyFeedbacks(citizenId: number): Promise<{
        id: number;
        created_at: Date;
        content: string;
        status: string;
        citizen_id: number;
        image_urls: string | null;
        admin_reply: string | null;
    }[]>;
}
