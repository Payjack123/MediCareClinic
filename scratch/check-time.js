const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();
async function main() {
  const schedule = await prisma.doctorSchedule.findFirst();
  console.log(schedule.timeSlots);
}
main().catch(console.error).finally(() => prisma.$disconnect());
