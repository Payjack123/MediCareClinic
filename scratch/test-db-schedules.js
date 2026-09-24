const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const schedules = await prisma.doctorSchedule.findMany({
    where: { doctorId: 30001 }
  });
  console.log('Schedules for doc 30001:', schedules);
}
main().finally(() => prisma.$disconnect());
