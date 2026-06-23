import { AdminDashboardService } from './admin-dashboard.service';
export declare class AdminDashboardController {
    private readonly adminDashboardService;
    constructor(adminDashboardService: AdminDashboardService);
    getStats(): Promise<{
        totalCitizens: number;
        totalFeedbacks: number;
        totalAppointments: number;
        totalNews: number;
        recentAppointments: ({
            citizen: {
                id: number;
                created_at: Date;
                full_name: string | null;
                phone: string | null;
                cccd: string | null;
                zalo_id: string;
                avatar_url: string | null;
            };
        } & {
            id: number;
            created_at: Date;
            ticket_number: string;
            appointment_date: Date;
            time_slot: string;
            content: string;
            status: string;
            citizen_id: number;
        })[];
    }>;
}
