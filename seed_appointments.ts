import { PrismaClient } from './lib/generated/prisma/index.js';

const prisma = new PrismaClient();

async function seedAppointments() {
  console.log('Bắt đầu tạo lịch hẹn cho 4 bệnh nhân vào bác sĩ Nguyễn Văn Bình...');

  // 1. Tìm bác sĩ Nguyễn Văn Bình
  let doctor = await prisma.user.findFirst({
    where: { fullName: { contains: 'Nguyễn Văn Bình' }, role: 'DOCTOR' }
  });

  if (!doctor) {
    doctor = await prisma.user.findUnique({ where: { id: 30001 } });
  }

  if (!doctor) {
    console.error('Không tìm thấy bác sĩ Nguyễn Văn Bình. Vui lòng tạo trước!');
    process.exit(1);
  }

  // 2. Tạo lịch làm việc (DoctorSchedule) cho các ngày 24, 25, 26 tháng 9
  const dates = ['2026-09-24', '2026-09-25', '2026-09-26'];
  const timeSlots = JSON.stringify([
    '08:00 - 08:30', '08:30 - 09:00', '09:00 - 09:30', '09:30 - 10:00',
    '13:30 - 14:00', '14:00 - 14:30', '14:30 - 15:00', '15:00 - 15:30'
  ]);

  for (const d of dates) {
    const existingSchedule = await prisma.doctorSchedule.findFirst({
      where: { doctorId: doctor.id, date: d }
    });
    
    if (!existingSchedule) {
      await prisma.doctorSchedule.create({
        data: {
          doctorId: doctor.id,
          date: d,
          timeSlots
        }
      });
      console.log(`Đã tạo lịch làm việc cho bác sĩ ngày ${d}`);
    } else {
      // Cập nhật lại timeSlots cho đầy đủ
      await prisma.doctorSchedule.update({
        where: { id: existingSchedule.id },
        data: { timeSlots }
      });
    }
  }

  // 3. Lấy 4 bệnh nhân đầu tiên (benhnhan1 -> benhnhan4)
  const patients = await prisma.user.findMany({
    where: { email: { in: ['benhnhan1@test.com', 'benhnhan2@test.com', 'benhnhan3@test.com', 'benhnhan4@test.com'] } }
  });

  if (patients.length < 4) {
    console.error('Không tìm đủ 4 bệnh nhân test. Vui lòng chạy lại seed_patients.ts trước!');
    process.exit(1);
  }

  // 4. Tạo các lịch hẹn (Appointments)
  // Bệnh nhân 1: Ngày 24/09, sáng
  // Bệnh nhân 2: Ngày 25/09, sáng
  // Bệnh nhân 3: Ngày 25/09, chiều
  // Bệnh nhân 4: Ngày 26/09, sáng
  
  const bookings = [
    { patient: patients[0], date: '24/09/2026', time: '08:00 - 08:30', status: 'Đã khám' },
    { patient: patients[1], date: '25/09/2026', time: '09:00 - 09:30', status: 'Đã check-in' },
    { patient: patients[2], date: '25/09/2026', time: '14:00 - 14:30', status: 'Đã đặt' },
    { patient: patients[3], date: '26/09/2026', time: '08:30 - 09:00', status: 'Đã xác nhận' }
  ];

  // Xoá các lịch hẹn trùng nếu chạy lại script
  await prisma.appointment.deleteMany({
    where: {
      patientId: { in: patients.map(p => p.id) },
      doctorId: doctor.id
    }
  });

  for (const b of bookings) {
    const apt = await prisma.appointment.create({
      data: {
        patientId: b.patient.id,
        doctorId: doctor.id,
        bookingDate: b.date,
        bookingTime: b.time,
        status: b.status,
        specialty: 'Nội tổng quát',
        reason: `Người khám: ${b.patient.fullName} - CCCD: Không rõ - SĐT: ${b.patient.phone}. Lý do: Khám tổng quát`,
        room: 'P. 201'
      }
    });
    console.log(`Đã đặt lịch cho ${b.patient.fullName} vào ${b.time} ngày ${b.date} (Trạng thái: ${b.status})`);
  }

  console.log('Hoàn thành việc tạo lịch hẹn!');
}

seedAppointments()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
