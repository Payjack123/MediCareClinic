const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const apts = await prisma.appointment.findMany({
    select: { id: true, specialty: true, room: true, reason: true },
    orderBy: { id: 'desc' },
    take: 5
  });
  console.log(apts);
}
main().catch(console.error).finally(() => prisma.$disconnect());
