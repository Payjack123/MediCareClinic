const { PrismaClient } = require('../lib/generated/prisma'); 
const prisma = new PrismaClient(); 
async function main() { 
  const invoices = await prisma.invoice.findMany(); 
  console.log(invoices); 
} 
main().catch(console.error).finally(() => prisma.$disconnect());
