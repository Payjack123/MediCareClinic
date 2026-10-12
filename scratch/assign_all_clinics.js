const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  // Link Doctor 4 & 6 to Clinic 5 (Cơ xương khớp Hà Nội) and Clinic 13 (VIP Hà Nội)
  await prisma.doctorProfile.update({
    where: { id: 4 },
    data: {
      clinics: {
        connect: [{ id: 5 }, { id: 13 }]
      }
    }
  });

  await prisma.doctorProfile.update({
    where: { id: 6 },
    data: {
      clinics: {
        connect: [{ id: 13 }]
      }
    }
  });

  // Link Doctor 10 & 18 & 17 to Clinic 14 (VIP Sài Gòn)
  await prisma.doctorProfile.update({
    where: { id: 10 },
    data: {
      clinics: {
        connect: [{ id: 14 }]
      }
    }
  });

  await prisma.doctorProfile.update({
    where: { id: 18 },
    data: {
      clinics: {
        connect: [{ id: 14 }]
      }
    }
  });

  console.log('Successfully connected remaining clinics with doctors!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
