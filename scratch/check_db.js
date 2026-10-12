const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const facilities = await prisma.facility.findMany({
    include: {
      clinics: {
        select: {
          id: true,
          name: true,
          facilityId: true,
          doctors: { select: { id: true, userId: true } }
        }
      }
    }
  });

  for (const f of facilities) {
    console.log(`\nFacility id=${f.id}, name="${f.name}":`);
    for (const c of f.clinics) {
      console.log(`  Clinic id=${c.id}, name="${c.name}"`);
    }
  }

  const doctors = await prisma.doctorProfile.findMany({
    select: {
      id: true,
      specialtyId: true,
      specialty: { select: { id: true, name: true } },
      user: { select: { fullName: true } }
    }
  });

  console.log('\nDOCTORS WITH SPECIALTY:');
  for (const d of doctors) {
    console.log(`Doctor id=${d.id}, name="${d.user?.fullName}", specialty="${d.specialty?.name}" (specId=${d.specialtyId})`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
