const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();
async function main() {
  const facilities = await prisma.facility.findMany();
  console.log(facilities.map(f => ({id: f.id, name: f.name, address: f.address})));
}
main().catch(console.error).finally(() => prisma.$disconnect());
