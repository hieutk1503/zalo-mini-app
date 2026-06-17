import { PrismaService } from '../prisma/prisma.service';
export declare class AppointmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    createAppointment(citizenId: number, data: {
        date: string;
        timeSlot: string;
        content: string;
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
    getMyAppointments(citizenId: number): Promise<{
        id: number;
        created_at: Date;
        ticket_number: string;
        appointment_date: Date;
        time_slot: string;
        content: string;
        status: string;
        citizen_id: number;
    }[]>;
}
