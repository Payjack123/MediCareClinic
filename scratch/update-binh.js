const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const doc = await prisma.user.findFirst({
    where: { fullName: { contains: 'Bình' }, role: 'DOCTOR' },
    include: { doctorProfile: { include: { specialty: true } } }
  });
  console.log('Current Doctor:', doc.id);

  const noiTongQuat = await prisma.specialty.findFirst({
    where: { name: 'Nội tổng quát' }
  });
  
  if (doc && noiTongQuat) {
    if (doc.doctorProfile) {
      await prisma.doctorProfile.update({
        where: { id: doc.doctorProfile.id },
        data: { specialtyId: noiTongQuat.id }
      });
    } else {
      await prisma.doctorProfile.create({
        data: {
          userId: doc.id,
          specialtyId: noiTongQuat.id,
          experience: '5 năm'
        }
      });
    }
    console.log('Updated/Created specialty successfully!');
  }
}

main().finally(() => prisma.$disconnect());
