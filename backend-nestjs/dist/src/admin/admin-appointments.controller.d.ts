import { AdminAppointmentsService } from './admin-appointments.service';
export declare class AdminAppointmentsController {
    private readonly adminAppointmentsService;
    constructor(adminAppointmentsService: AdminAppointmentsService);
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
