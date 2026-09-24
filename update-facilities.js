const { PrismaClient } = require('./lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log('Đang làm mới dữ liệu Cơ sở khám...');

  // 1. Xoá toàn bộ phòng khám cũ (vì nó phụ thuộc cơ sở khám)
  await prisma.clinic.deleteMany();
  // 2. Xoá toàn bộ cơ sở khám cũ
  await prisma.facility.deleteMany();

  // 3. Tạo 2 cơ sở khám mới
  const f1 = await prisma.facility.create({
    data: {
      name: 'BỆNH VIỆN MEDICARE - HÀ NỘI',
      address: 'Số 1, đường Trần Duy Hưng, Cầu Giấy, Hà Nội',
    },
  });

  const f2 = await prisma.facility.create({
    data: {
      name: 'BỆNH VIỆN MEDICARE - HỒ CHÍ MINH',
      address: 'Số 10, đường Lê Duẩn, Quận 1, TP. Hồ Chí Minh',
    },
  });

  // 4. Lấy chuyên khoa đang có
  const specialties = await prisma.specialty.findMany();
  const s1 = specialties.find(s => s.name === 'Nội tổng quát') || specialties[0];
  const s2 = specialties.find(s => s.name === 'Tim mạch') || specialties[0];

  // 5. Tạo phòng khám mẫu cho 2 cơ sở này
  const c1 = await prisma.clinic.create({
    data: {
      name: 'Phòng khám Đa khoa 1 (Medicare Hà Nội)',
      type: 'Đa khoa',
      facilityId: f1.id,
      specialtyId: s1?.id,
    },
  });
  
  const c2 = await prisma.clinic.create({
    data: {
      name: 'Phòng khám Tim mạch (Medicare HCM)',
      type: 'Chuyên khoa Tim mạch',
      facilityId: f2.id,
      specialtyId: s2?.id,
    },
  });

  // 6. Cập nhật lại Bác sĩ gắn vào các phòng khám mới
  const doctors = await prisma.doctorProfile.findMany();
  if (doctors.length > 0) {
    for (const doc of doctors) {
      await prisma.doctorProfile.update({
        where: { id: doc.id },
        data: {
          clinics: {
            connect: [{ id: c1.id }, { id: c2.id }],
          },
        },
      });
    }
  }

  console.log('Đã cập nhật thành công 2 cơ sở khám mới Medicare!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
