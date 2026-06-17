import { AdminFeedbacksService } from './admin-feedbacks.service';
export declare class AdminFeedbacksController {
    private readonly adminFeedbacksService;
    constructor(adminFeedbacksService: AdminFeedbacksService);
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
    updateStatus(id: number, body: {
        status: string;
        admin_reply?: string;
    }): Promise<{
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
