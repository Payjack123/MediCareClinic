const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const tables = await prisma.$queryRaw`SHOW TABLES`;
  console.log('TABLES:', tables);
}

main().catch(console.error).finally(() => prisma.$disconnect());
