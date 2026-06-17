import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AdminAuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(email: string, pass: string): Promise<{
        access_token: string;
        admin: {
            id: number;
            email: string;
            full_name: string;
            role: string;
        };
    }>;
}
