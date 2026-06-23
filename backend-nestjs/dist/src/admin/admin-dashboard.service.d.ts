import { PrismaService } from '../prisma/prisma.service';
export declare class AdminDashboardService {
    private prisma;
    constructor(prisma: PrismaService);
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
