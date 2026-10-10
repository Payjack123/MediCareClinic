const { PrismaClient } = require('../lib/generated/prisma'); 
const prisma = new PrismaClient(); 
async function main() { 
  await prisma.invoice.update({ 
    where: { invoiceCode: 'HD330002' }, 
    data: { status: 'Chưa thanh toán', paymentMethod: null, paymentDate: null }
  }); 
  console.log('Reset to Chưa thanh toán'); 
} 
main().catch(console.error).finally(() => prisma.$disconnect());
