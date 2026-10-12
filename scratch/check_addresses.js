const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const doctors = await prisma.doctorProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          address: true,
          email: true,
          phone: true,
        }
      },
      clinics: {
        include: {
          facility: true
        }
      }
    },
    orderBy: { id: 'asc' }
  });

  console.log('ALL DOCTORS USER ADDRESS:');
  for (const d of doctors) {
    console.log(`Doctor id=${d.id}, name="${d.user.fullName}", address="${d.user.address}", clinics=${d.clinics.map(c => `${c.name} (${c.facility?.name})`).join(', ')}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
