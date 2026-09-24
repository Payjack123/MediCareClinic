const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log('Đang khôi phục lịch cho BS Nguyễn Văn Bình...');
  
  const timeSlotsPool = ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];
  const docId = 30001; // Nguyễn Văn Bình
  
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    
    // Bỏ qua Thứ 7 (6) và Chủ nhật (0)
    if (d.getDay() === 0 || d.getDay() === 6) {
      continue;
    }

    const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    // Lấy clinic của BS Bình (nếu có)
    const profile = await prisma.doctorProfile.findUnique({
      where: { userId: docId },
      include: { clinics: true }
    });
    
    let clinicId = docId;
    if (profile && profile.clinics.length > 0) {
      clinicId = profile.clinics[0].id;
    }

    await prisma.doctorSchedule.create({
      data: {
        doctorId: docId,
        clinicId: clinicId,
        date: dateString,
        timeSlots: timeSlotsPool
      }
    });
  }
  console.log('Xong!');
}
main().finally(() => prisma.$disconnect());
