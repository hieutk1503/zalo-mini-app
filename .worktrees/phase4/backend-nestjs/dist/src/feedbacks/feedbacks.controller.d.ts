import { FeedbacksService } from './feedbacks.service';
import type { Citizen } from '@prisma/client';
export declare class FeedbacksController {
    private readonly feedbacksService;
    constructor(feedbacksService: FeedbacksService);
    create(user: Citizen, data: {
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
    findAll(user: Citizen): Promise<{
        id: number;
        created_at: Date;
        content: string;
        status: string;
        citizen_id: number;
        image_urls: string | null;
        admin_reply: string | null;
    }[]>;
}
