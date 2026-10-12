const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const doctors = await prisma.doctorProfile.findMany({
    include: {
      user: true,
      specialty: true,
      clinics: {
        include: { facility: true }
      }
    },
    orderBy: { id: 'asc' }
  });

  doctors.forEach(d => {
    console.log(`BS ${d.id}: ${d.user.fullName} | Chuyên khoa: ${d.specialty?.name} | Cơ sở: ${d.clinics.map(c => `${c.name} (${c.facility?.name})`).join(', ')}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
