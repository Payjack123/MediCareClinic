const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();
const dayjs = require('dayjs');

async function main() {
  const doctors = await prisma.user.findMany({
    where: { role: 'DOCTOR' },
    include: { doctorProfile: { include: { clinics: true } } }
  });

  const timeSlots = [
    "06:15", "06:30", "06:45", "07:00", "07:15", "07:30", "07:45",
    "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00"
  ];
  const timeSlotsJson = JSON.stringify(timeSlots);

  let createdCount = 0;

  for (const doc of doctors) {
    if (!doc.doctorProfile) continue;
    
    // Xóa lịch cũ nếu có bằng raw query
    await prisma.$executeRawUnsafe(`DELETE FROM DoctorSchedule WHERE doctorId = ${doc.id}`);

    const clinicId = doc.doctorProfile.clinics.length > 0 ? doc.doctorProfile.clinics[0].id : null;

    // Giả lập bác sĩ này chỉ làm việc vào các ngày: chẵn hoặc lẻ ngẫu nhiên
    const isEvenDays = doc.id % 2 === 0;

    for (let i = 0; i < 14; i++) {
      const currentDate = dayjs().add(i, 'day');
      const dayOfWeek = currentDate.day(); 
      
      // Bỏ qua Chủ Nhật (0)
      if (dayOfWeek === 0) continue;

      let worksToday = false;
      if (isEvenDays && [2, 4, 6].includes(dayOfWeek)) worksToday = true;
      if (!isEvenDays && [1, 3, 5].includes(dayOfWeek)) worksToday = true;
      
      // Nếu là Nguyễn Văn Bình thì ưu tiên làm T2, T3, T4, T5, T6
      if (doc.fullName.includes('Bình')) {
        worksToday = [1, 2, 3, 4, 5].includes(dayOfWeek);
      }

      if (worksToday) {
        const dateStr = currentDate.format('YYYY-MM-DD');
        if (clinicId) {
          await prisma.$executeRawUnsafe(`INSERT INTO DoctorSchedule (doctorId, clinicId, date, timeSlots, createdAt, updatedAt) VALUES (${doc.id}, ${clinicId}, '${dateStr}', '${timeSlotsJson}', NOW(), NOW())`);
        } else {
          await prisma.$executeRawUnsafe(`INSERT INTO DoctorSchedule (doctorId, date, timeSlots, createdAt, updatedAt) VALUES (${doc.id}, '${dateStr}', '${timeSlotsJson}', NOW(), NOW())`);
        }
        createdCount++;
      }
    }
  }

  console.log(`Đã tạo ${createdCount} lịch làm việc cho các bác sĩ trong 14 ngày tới!`);
}

main().finally(() => prisma.$disconnect());
