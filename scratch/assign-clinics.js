const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const doctors = await prisma.user.findMany({
    where: { role: 'DOCTOR' },
    include: { doctorProfile: { include: { specialty: true, clinics: true } } }
  });

  const clinics = await prisma.clinic.findMany();

  for (const doc of doctors) {
    if (!doc.doctorProfile) continue;

    // Tìm phòng khám phù hợp với tên chuyên khoa
    const specialtyName = doc.doctorProfile.specialty?.name?.toLowerCase() || '';
    
    // Nếu chuyên khoa là Nội tổng quát, gán cho một phòng khám ngẫu nhiên có chữ Nội, hoặc Đa khoa
    let matchingClinics = clinics.filter(c => c.name.toLowerCase().includes(specialtyName));
    
    if (matchingClinics.length === 0) {
      if (specialtyName.includes('nội')) {
        matchingClinics = clinics.filter(c => c.name.toLowerCase().includes('nội'));
      } else {
        matchingClinics = clinics.filter(c => c.name.toLowerCase().includes('cơ xương khớp') || c.name.toLowerCase().includes('đa khoa'));
      }
    }

    if (matchingClinics.length > 0) {
      // Gán 1-2 phòng khám đầu tiên cho bác sĩ
      const clinicsToAssign = matchingClinics.slice(0, 1).map(c => ({ id: c.id }));
      
      await prisma.doctorProfile.update({
        where: { id: doc.doctorProfile.id },
        data: {
          clinics: {
            connect: clinicsToAssign
          }
        }
      });
      console.log(`Đã gán BS ${doc.fullName} (${specialtyName}) vào: ${matchingClinics.slice(0, 1).map(c => c.name).join(', ')}`);
    } else {
      console.log(`Không tìm thấy phòng khám phù hợp cho BS ${doc.fullName} (${specialtyName})`);
    }
  }

  console.log('Hoàn tất phân bổ phòng khám cho bác sĩ!');
}

main().finally(() => prisma.$disconnect());
