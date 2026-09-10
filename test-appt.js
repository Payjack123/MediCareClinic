const { PrismaClient } = require('./lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const appt = await prisma.appointment.findFirst({
    where: { appointmentCode: 'LH17339772' }
  });
  console.log('Appt:', appt);
}

main().finally(() => prisma.$disconnect());
