import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = 'postgresql://root:password@127.0.0.1:5433/tu_lan_smart?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const all = await prisma.administrativeProcedure.findMany();
    console.log("ALL PROCEDURES:", JSON.stringify(all, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
