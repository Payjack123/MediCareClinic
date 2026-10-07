import { PrismaClient } from './lib/generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedPatients() {
  console.log('Bắt đầu tạo 18 bệnh nhân...');
  
  const passwordHash = await bcrypt.hash('123456', 10);
  
  const ho = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
  const dem = ['Văn', 'Thị', 'Đức', 'Hữu', 'Minh', 'Ngọc', 'Hải', 'Xuân', 'Quang', 'Hồng', 'Thanh', 'Quỳnh'];
  const ten = ['Anh', 'Bình', 'Cường', 'Dũng', 'Em', 'Phong', 'Giang', 'Hà', 'Khánh', 'Lan', 'Nam', 'Oanh', 'Phương', 'Quốc', 'Sơn', 'Trang', 'Uyên', 'Vy', 'Xuân', 'Yến'];
  const addressList = [
    'Quận 1, TP.HCM', 'Quận 3, TP.HCM', 'Quận 5, TP.HCM', 'Quận 7, TP.HCM', 'Quận 10, TP.HCM', 
    'Tân Bình, TP.HCM', 'Gò Vấp, TP.HCM', 'Thủ Đức, TP.HCM', 'Bình Thạnh, TP.HCM', 'Phú Nhuận, TP.HCM'
  ];

  let createdCount = 0;

  for (let i = 1; i <= 18; i++) {
    const randomHo = ho[Math.floor(Math.random() * ho.length)];
    const randomDem = dem[Math.floor(Math.random() * dem.length)];
    const randomTen = ten[Math.floor(Math.random() * ten.length)];
    
    const fullName = `${randomHo} ${randomDem} ${randomTen}`;
    const email = `benhnhan${i}@test.com`;
    const phone = `09${Math.floor(Math.random() * 89999999 + 10000000)}`;
    const gender = Math.random() > 0.5 ? 'Nam' : 'Nữ';
    const address = addressList[Math.floor(Math.random() * addressList.length)];
    
    // Sinh năm từ 1960 đến 2010
    const birthYear = Math.floor(Math.random() * 50 + 1960);
    const dob = `${Math.floor(Math.random() * 28 + 1)}/${Math.floor(Math.random() * 12 + 1)}/${birthYear}`;
    
    // CCCD 12 số ngẫu nhiên
    const cccd = `0${Math.floor(Math.random() * 89 + 10)}0${Math.floor(Math.random() * 89 + 10)}${Math.floor(Math.random() * 899999 + 100000)}`;
    const patientCode = `BN${String(i).padStart(4, '0')}`;

    try {
      await prisma.user.upsert({
        where: { email },
        update: {
          fullName,
          passwordHash,
          phone,
          gender,
          dob,
          address,
          patientProfile: {
            upsert: {
              create: {
                patientCode,
                cccd
              },
              update: {
                patientCode,
                cccd
              }
            }
          }
        },
        create: {
          email,
          fullName,
          passwordHash,
          role: 'PATIENT',
          phone,
          gender,
          dob,
          address,
          patientProfile: {
            create: {
              patientCode,
              cccd
            }
          }
        }
      });
      console.log(`Đã tạo bệnh nhân ${i}: ${fullName} - ${email}`);
      createdCount++;
    } catch (err) {
      console.error(`Lỗi tạo bệnh nhân ${email}:`, err);
    }
  }

  console.log(`Đã tạo thành công ${createdCount}/18 bệnh nhân.`);
}

seedPatients()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
