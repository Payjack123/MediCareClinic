const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log("Đang xóa dữ liệu hóa đơn (Invoice)...");
  const invoices = await prisma.invoice.deleteMany();
  console.log(`Đã xóa ${invoices.count} hóa đơn.`);

  console.log("Đang xóa dữ liệu hồ sơ bệnh án (Examination)...");
  const exams = await prisma.examination.deleteMany();
  console.log(`Đã xóa ${exams.count} hồ sơ bệnh án.`);

  console.log("Đang xóa dữ liệu lịch khám (Appointment)...");
  const appointments = await prisma.appointment.deleteMany();
  console.log(`Đã xóa ${appointments.count} lịch khám.`);

  console.log("Xóa dữ liệu thành công!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
