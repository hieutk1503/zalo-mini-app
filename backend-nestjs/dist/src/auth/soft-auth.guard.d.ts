import { CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ZaloAuthService } from './zalo-auth.service';
export declare class SoftAuthGuard implements CanActivate {
    private prisma;
    private zaloAuthService;
    constructor(prisma: PrismaService, zaloAuthService: ZaloAuthService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private authenticateWithDevHeaders;
    private upsertCitizen;
}
