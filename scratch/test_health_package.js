const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`SELECT * FROM HealthPackage`;
  console.log('HealthPackage table contents:', result);
}

main().catch(console.error).finally(() => prisma.$disconnect());
