const { PrismaClient } = require('./lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log('Đang tạo bệnh nhân mẫu để tra cứu...');

  // 1. Tạo tài khoản User cho bệnh nhân mẫu
  const user = await prisma.user.upsert({
    where: { email: 'trannamkhanh@medicare.com' },
    update: {},
    create: {
      fullName: 'Trần Nam Khánh',
      email: 'trannamkhanh@medicare.com',
      passwordHash: 'hashed_password_dummy',
      role: 'PATIENT',
      phone: '0988888888',
      dob: '1985-12-25',
      gender: 'Nam',
      address: 'Hồ Chí Minh',
    },
  });

  // 2. Tạo Profile cho bệnh nhân mẫu với CCCD cố định
  await prisma.patientProfile.upsert({
    where: { userId: user.id },
    update: {
      cccd: '012345999888',
    },
    create: {
      userId: user.id,
      patientCode: 'BN-DUMMY2',
      cccd: '012345999888',
    },
  });

  console.log('Tạo thành công bệnh nhân Trần Nam Khánh để test tra cứu!');
  console.log('Tên: Người thân mẫu');
  console.log('Ngày sinh: 1990-01-01');
  console.log('CCCD: 012345678910');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
