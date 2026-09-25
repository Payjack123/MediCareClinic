const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const docs = await prisma.doctorProfile.findMany({
    include: {
      user: true,
      clinics: true
    }
  });
  
  for (const doc of docs) {
    if (doc.clinics.length > 0) {
      console.log(`- ${doc.user.fullName}: Đã có ${doc.clinics.length} phòng khám (${doc.clinics.map(c => c.name).join(', ')})`);
    } else {
      console.log(`- ${doc.user.fullName}: CHƯA CÓ PHÒNG KHÁM`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
