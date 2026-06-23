import { PrismaService } from '../prisma/prisma.service';
export declare class AppointmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    createAppointment(citizenId: number, data: {
        date: string;
        timeSlot: string;
        content: string;
        fullName?: string;
        phone?: string;
        cccd?: string;
    }): Promise<{
        id: number;
        created_at: Date;
        ticket_number: string;
        appointment_date: Date;
        time_slot: string;
        content: string;
        status: string;
        citizen_id: number;
    }>;
    private generateTicketNumber;
    getMyAppointments(citizenId: number): Promise<({
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
    })[]>;
    getAllForAdmin(): Promise<({
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
