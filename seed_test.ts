import { PrismaClient } from './lib/generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding test patient for doctor Nguyễn Văn Bình...');
  
  // 1. Find the doctor
  let doctor = await prisma.user.findFirst({
    where: { fullName: { contains: 'Nguyễn Văn Bình' }, role: 'DOCTOR' }
  });

  if (!doctor) {
    // try finding doctor ID 30001
    doctor = await prisma.user.findUnique({ where: { id: 30001 } });
  }

  if (!doctor) {
    console.log('Could not find doctor. Creating one...');
    doctor = await prisma.user.create({
      data: {
        id: 30001,
        email: 'binh.nguyen@medicare.com',
        password: 'hash',
        fullName: 'BS. Nguyễn Văn Bình',
        phone: '0988888888',
        role: 'DOCTOR',
        doctorProfile: {
          create: {
            experience: '10 năm',
          }
        }
      }
    });
  }

  console.log('Doctor found:', doctor.fullName, '(ID:', doctor.id, ')');

  // 2. Ensure doctor has a schedule for today
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  let schedule = await prisma.doctorSchedule.findFirst({
    where: { doctorId: doctor.id, date: dateStr }
  });

  if (!schedule) {
    schedule = await prisma.doctorSchedule.create({
      data: {
        doctorId: doctor.id,
        date: dateStr,
        timeSlots: JSON.stringify(["08:00", "08:30", "09:00", "09:30"]),
      }
    });
    console.log('Created schedule for today:', dateStr);
  } else {
    console.log('Schedule already exists for today:', dateStr);
  }

  // 3. Create a patient if needed
  let patient = await prisma.user.findFirst({
    where: { role: 'PATIENT' }
  });

  if (!patient) {
    patient = await prisma.user.create({
      data: {
        email: 'patient@test.com',
        password: 'hash',
        fullName: 'Bệnh Nhân Test',
        phone: '0123456789',
        role: 'PATIENT'
      }
    });
  }

  console.log('Patient found:', patient.fullName);

  // 4. Create an appointment for today
  const bookingDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  
  // Clean up any existing test appointments for this doctor today to avoid duplicates
  await prisma.appointment.deleteMany({
    where: {
      doctorId: doctor.id,
      bookingDate: bookingDate,
      reason: { contains: 'Khám tổng quát định kỳ' }
    }
  });

  const apt = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      bookingDate: bookingDate, // DD/MM/YYYY
      bookingTime: '08:30 - 09:00',
      status: 'Đã check-in',
      specialty: 'Nội tổng quát',
      reason: 'Người khám: Nguyễn Văn A - CCCD: 0123456789 - SĐT: 0987654321 - ĐC: Hà Nội. Lý do: Khám tổng quát định kỳ',
      room: 'P. 201'
    }
  });

  console.log('Successfully created test appointment:', apt.id);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
