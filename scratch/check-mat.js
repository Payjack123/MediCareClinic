const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();
async function main() {
  const clinics = await prisma.clinic.findMany({ where: { name: { contains: 'Mắt' } } });
  console.log(clinics);
}
main().catch(console.error).finally(() => prisma.$disconnect());
