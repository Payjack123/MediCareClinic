const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const facilities = await prisma.facility.findMany();
  console.log('FACILITIES:', facilities);

  const clinics = await prisma.clinic.findMany({
    include: {
      facility: true,
      specialty: true,
      department: true,
      doctors: {
        include: {
          user: true
        }
      }
    }
  });
  console.log(`CLINICS COUNT: ${clinics.length}`);
  clinics.forEach(c => {
    console.log(`ID: ${c.id} | Name: ${c.name} | Facility: ${c.facility?.name} (${c.facility?.address}) | Specialty: ${c.specialty?.name} | Doctors count: ${c.doctors.length}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
