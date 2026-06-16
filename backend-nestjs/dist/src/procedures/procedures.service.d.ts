import { PrismaService } from '../prisma/prisma.service';
export declare class ProceduresService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): any;
    findOne(id: number): any;
}
