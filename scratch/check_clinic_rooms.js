const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const clinics = await prisma.clinic.findMany();
  console.log(clinics.map(c => ({ id: c.id, name: c.name, roomNumber: c.roomNumber, type: c.type, facilityId: c.facilityId })));
}

main().catch(console.error).finally(() => prisma.$disconnect());
