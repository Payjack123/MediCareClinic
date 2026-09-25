const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const doc = await prisma.user.findFirst({
    where: { fullName: { contains: 'Thu Hà' } },
    include: { doctorProfile: { include: { clinics: true, specialty: true } } }
  });
  
  if (!doc) {
    console.log("Not found doctor");
    return;
  }
  
  console.log('Doctor:', doc.fullName);
  console.log('Specialty:', doc.doctorProfile?.specialty?.name);
  console.log('Clinics:', doc.doctorProfile?.clinics?.map(c => c.name));

  const schedules = await prisma.doctorSchedule.findMany({
    where: { doctorId: doc.id },
    include: { clinic: true }
  });
  console.log('Schedules count:', schedules.length);
  if (schedules.length > 0) {
    console.log('First schedule clinic:', schedules[0].clinic?.name);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
