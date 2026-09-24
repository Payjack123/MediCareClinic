const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const facilities = await prisma.facility.findMany();
  console.log('Facilities:', facilities);
  
  const clinics = await prisma.clinic.findMany();
  console.log(`Total clinics: ${clinics.length}`);
  console.log('Clinics:', clinics);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
