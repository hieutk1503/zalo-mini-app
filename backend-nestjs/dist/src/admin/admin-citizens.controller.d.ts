import { AdminCitizensService } from './admin-citizens.service';
export declare class AdminCitizensController {
    private readonly adminCitizensService;
    constructor(adminCitizensService: AdminCitizensService);
    findAll(): Promise<({
        appointments: {
            id: number;
            created_at: Date;
            ticket_number: string;
            appointment_date: Date;
            time_slot: string;
            content: string;
            status: string;
            citizen_id: number;
        }[];
    } & {
        id: number;
        full_name: string | null;
        created_at: Date;
        phone: string | null;
        cccd: string | null;
        zalo_id: string;
        avatar_url: string | null;
    })[]>;
}
