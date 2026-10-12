const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

const CLINIC_MAP_HN = {
  1: 1, // Nội tổng quát -> Clinic 1
  2: 2, // Tim mạch -> Clinic 2
  3: 3, // Da liễu -> Clinic 3
  4: 4, // Răng hàm mặt -> Clinic 4
  5: 5, // Cơ xương khớp -> Clinic 5
  6: 6, // Mắt -> Clinic 6
  null: 1, // Đa khoa -> Clinic 1
};

const CLINIC_MAP_SG = {
  1: 7,  // Nội tổng quát -> Clinic 7
  2: 8,  // Tim mạch -> Clinic 8
  3: 9,  // Da liễu -> Clinic 9
  4: 10, // Răng hàm mặt -> Clinic 10
  5: 11, // Cơ xương khớp -> Clinic 11
  6: 12, // Mắt -> Clinic 12
  null: 7, // Đa khoa -> Clinic 7
};

async function main() {
  const doctors = await prisma.doctorProfile.findMany({
    include: { user: true }
  });

  for (const doc of doctors) {
    const isSG = doc.user.address?.includes('Hồ Chí Minh') || doc.user.address?.includes('Sài Gòn') || doc.id >= 10;
    const clinicId = isSG 
      ? (CLINIC_MAP_SG[doc.specialtyId] || 7)
      : (CLINIC_MAP_HN[doc.specialtyId] || 1);

    await prisma.doctorProfile.update({
      where: { id: doc.id },
      data: {
        clinics: {
          set: [{ id: clinicId }]
        }
      }
    });
    console.log(`Updated Doctor ${doc.id} (${doc.user.fullName}, address="${doc.user.address}") -> Clinic ${clinicId} (${isSG ? 'MediCare Sài Gòn' : 'MediCare Hà Nội'})`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
