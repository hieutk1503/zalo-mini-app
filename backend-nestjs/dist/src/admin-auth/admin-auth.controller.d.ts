import { AdminAuthService } from './admin-auth.service';
export declare class AdminAuthController {
    private adminAuthService;
    constructor(adminAuthService: AdminAuthService);
    login(loginDto: Record<string, any>): Promise<{
        access_token: string;
        admin: {
            id: number;
            email: string;
            full_name: string;
            role: string;
        };
    }>;
}
