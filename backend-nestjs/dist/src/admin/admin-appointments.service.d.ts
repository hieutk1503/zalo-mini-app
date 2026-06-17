import { PrismaService } from '../prisma/prisma.service';
export declare class AdminAppointmentsService {
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
        ticket_number: string;
        appointment_date: Date;
        time_slot: string;
        content: string;
        status: string;
        citizen_id: number;
    })[]>;
    updateStatus(id: number, status: string): Promise<{
        id: number;
        created_at: Date;
        ticket_number: string;
        appointment_date: Date;
        time_slot: string;
        content: string;
        status: string;
        citizen_id: number;
    }>;
}
