const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();
async function main() {
  // Bác sĩ đang ở Phòng khám Mắt (90001)
  const docs = await prisma.doctorProfile.findMany({ 
    where: { clinics: { some: { id: 90001 } } },
  });

  // Chuyển họ sang Phòng khám Mắt 1 (30011) và xóa khỏi 90001
  for (const doc of docs) {
    await prisma.doctorProfile.update({
      where: { id: doc.id },
      data: {
        clinics: {
          disconnect: { id: 90001 },
          connect: { id: 30011 }
        }
      }
    });
    console.log(`Updated doc ${doc.id}`);
  }

  // Update DoctorSchedule cho đúng clinicId
  await prisma.doctorSchedule.updateMany({
    where: { clinicId: 90001 },
    data: { clinicId: 30011 }
  });

  // Xóa clinic 90001
  await prisma.clinic.delete({ where: { id: 90001 } });
  console.log("Deleted clinic 90001");
}
main().catch(console.error).finally(() => prisma.$disconnect());
