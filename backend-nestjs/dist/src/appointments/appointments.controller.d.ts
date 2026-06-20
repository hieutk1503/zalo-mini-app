import { AppointmentsService } from './appointments.service';
import type { Citizen } from '@prisma/client';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(user: Citizen, data: {
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
    findAll(user: Citizen): Promise<({
        citizen: {
            id: number;
            full_name: string | null;
            created_at: Date;
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
}
