import { PrismaClient } from './lib/generated/prisma/index.js';
const prisma = new PrismaClient();

async function clearData() {
  console.log('Clearing old schedules and appointments...');

  try {
    // Delete depending models first to avoid FK errors
    const invoices = await prisma.invoice.deleteMany({});
    console.log(`Deleted ${invoices.count} invoices.`);

    const examinations = await prisma.examination.deleteMany({});
    console.log(`Deleted ${examinations.count} examinations.`);

    // Delete appointments
    const appointments = await prisma.appointment.deleteMany({});
    console.log(`Deleted ${appointments.count} appointments.`);

    // Delete schedules
    const schedules = await prisma.doctorSchedule.deleteMany({});
    console.log(`Deleted ${schedules.count} schedules.`);

    console.log('All data cleared successfully!');
  } catch (err) {
    console.error('Error clearing data:', err);
  } finally {
    await prisma.$disconnect();
  }
}

clearData();
