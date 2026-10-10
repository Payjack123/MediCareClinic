const { PrismaClient } = require('../lib/generated/prisma'); 
const prisma = new PrismaClient(); 
async function main() { 
  await prisma.invoice.update({ 
    where: { invoiceCode: 'HD330002' }, 
    data: { paymentMethod: 'Chuyển khoản' }
  }); 
  console.log('Updated to Chuyển khoản'); 
} 
main().catch(console.error).finally(() => prisma.$disconnect());
