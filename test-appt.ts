import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const appt = await prisma.appointment.findFirst({
    where: { appointmentCode: 'LH17339772' }
  });
  console.log('Appt:', appt);
}

main().finally(() => prisma.$disconnect());
