const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();
async function main() {
  const docs = await prisma.doctorProfile.findMany({ 
    where: { clinics: { some: { name: 'Phòng khám Mắt 1' } } },
    include: { user: true }
  });
  console.log('Docs in Mắt 1:', docs.length);
  const docs2 = await prisma.doctorProfile.findMany({ 
    where: { clinics: { some: { name: 'Phòng khám Mắt' } } },
    include: { user: true }
  });
  console.log('Docs in Mắt:', docs2.length);
}
main().catch(console.error).finally(() => prisma.$disconnect());
