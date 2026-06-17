import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL || 'postgresql://root:password@127.0.0.1:5433/tu_lan_smart?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'admin@visssoft.vn';
  const existingAdmin = await prisma.admin.findUnique({ where: { email } });

  if (!existingAdmin) {
    const password_hash = await bcrypt.hash('123456', 10);
    await prisma.admin.create({
      data: {
        email,
        password_hash,
        full_name: 'Super Admin',
        role: 'SUPER_ADMIN',
      },
    });
    console.log('Seed: Super Admin created!');
  } else {
    console.log('Seed: Super Admin already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
