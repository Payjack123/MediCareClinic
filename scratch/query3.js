const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findFirst({
    where: { fullName: 'Bệnh nhân 1' },
    include: {
      labTests: true,
      prescriptions: { include: { items: true } },
      appointmentsAsPatient: { include: { invoice: true, examination: true } }
    }
  });
  console.log(JSON.stringify(user, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
