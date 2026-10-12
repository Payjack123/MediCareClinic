const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  if (prisma.healthPackage) {
    console.log('prisma.healthPackage exists!');
  } else {
    console.log('prisma.healthPackage does NOT exist yet in client');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
