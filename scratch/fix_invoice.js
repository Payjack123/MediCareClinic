const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();
async function main() {
  const invoice = await prisma.invoice.findFirst({
    where: { invoiceCode: "HD330002" },
    include: { items: true }
  });

  if (invoice) {
    console.log("Found invoice:", invoice);
    // Delete existing items
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: invoice.id }
    });

    // Re-create items with correct amounts: lab: 150000, med: 90000
    const newItems = [
      { name: 'Xét nghiệm cận lâm sàng (1 chỉ định)', price: 150000, quantity: 1, total: 150000, invoiceId: invoice.id },
      { name: 'Tiền thuốc theo đơn (2 loại)', price: 90000, quantity: 1, total: 90000, invoiceId: invoice.id }
    ];

    await prisma.invoiceItem.createMany({
      data: newItems
    });

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        totalAmount: 240000,
        finalAmount: 240000,
        status: "Chưa thanh toán" // Need to ask patient to pay
      }
    });
    console.log("Invoice updated successfully.");
  } else {
    console.log("Invoice not found.");
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
