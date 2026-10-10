const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({
    where: { fullName: { contains: 'Bệnh nhân' } },
    include: {
      labTests: true,
      prescriptions: { include: { items: true } },
      appointmentsAsPatient: { include: { invoice: true, examination: true } }
    }
  });
  console.log(JSON.stringify(users, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
