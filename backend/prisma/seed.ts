import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_USER_EMAIL ?? 'user@example.com';
  const password = process.env.SEED_USER_PASSWORD ?? 'password123';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Seed user ${email} already exists, skipping.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      uuid: 'UID-87F9A01B',
      email,
      name: 'Administrator Demo',
      passwordHash,
    },
  });

  await prisma.transaction.createMany({
    data: [
      {
        displayId: 'TX-7711C',
        userId: user.id,
        action: 'DEPOSIT CASH POOL',
        flow: '+$20,000.00 USD',
        hash: '0x119fa99e...a2b2',
        verification: 'SYSTEM-INIT',
      },
      {
        displayId: 'TX-8842B',
        userId: user.id,
        action: 'BUY Ethereum (ETH)',
        asset: 'ETH',
        flow: '+0.8450 ETH / -$2,940.77 USD',
        hash: '0x4cc9d11b...fa22',
        verification: 'VRD-OK-44',
      },
      {
        displayId: 'TX-9021A',
        userId: user.id,
        action: 'BUY Bitcoin (BTC)',
        asset: 'BTC',
        flow: '+0.0245 BTC / -$1,647.39 USD',
        hash: '0x8fa3f80c...b11a',
        verification: 'VRD-OK-98',
      },
    ],
  });

  console.log(`Seeded demo user: ${email} / ${password}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
