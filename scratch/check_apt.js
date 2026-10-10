const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

prisma.appointment.findMany().then(res => {
  console.dir(res, { depth: null });
}).finally(() => {
  prisma.$disconnect();
});
