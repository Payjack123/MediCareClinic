const { PrismaClient } = require('./lib/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const specialties = [
  "Mắt",
  "Tim mạch",
  "Nội tổng quát",
  "Da liễu",
  "Cơ xương khớp",
  "Răng hàm mặt"
];

const doctorsData = [
  // Khoa Mắt (Miền Bắc)
  {
    name: "BS. CKII. Nguyễn Thị Thu Hà",
    email: "thuha.nguyen@medicare.com",
    specialty: "Mắt",
    experience: "15 năm",
    gender: "Nữ",
    address: "Hà Nội",
    description: "Chuyên gia hàng đầu về phẫu thuật khúc xạ và điều trị các bệnh lý võng mạc.",
    avatar: "https://i.pravatar.cc/150?u=doc1"
  },
  {
    name: "ThS. BS. Trần Văn Minh",
    email: "vanminh.tran@medicare.com",
    specialty: "Mắt",
    experience: "10 năm",
    gender: "Nam",
    address: "Hà Nội",
    description: "Nhiều năm kinh nghiệm trong điều trị đục thủy tinh thể và cườm nước.",
    avatar: "https://i.pravatar.cc/150?u=doc2"
  },
  {
    name: "BS. CKI. Lê Ngọc Mai",
    email: "ngocmai.le@medicare.com",
    specialty: "Mắt",
    experience: "8 năm",
    gender: "Nữ",
    address: "Hà Nội",
    description: "Chuyên khám và điều trị các bệnh lý về mắt ở trẻ em và đo khúc xạ.",
    avatar: "https://i.pravatar.cc/150?u=doc3"
  },

  // Khoa Tim mạch (Miền Bắc)
  {
    name: "PGS. TS. BS. Phạm Hoàng Anh",
    email: "hoanganh.pham@medicare.com",
    specialty: "Tim mạch",
    experience: "25 năm",
    gender: "Nam",
    address: "Hà Nội",
    description: "Chuyên gia can thiệp tim mạch và siêu âm tim chuyên sâu.",
    avatar: "https://i.pravatar.cc/150?u=doc4"
  },
  {
    name: "BS. CKII. Vũ Thị Thanh Tâm",
    email: "thanhtam.vu@medicare.com",
    specialty: "Tim mạch",
    experience: "18 năm",
    gender: "Nữ",
    address: "Hà Nội",
    description: "Điều trị các bệnh lý cao huyết áp, suy tim và nhồi máu cơ tim.",
    avatar: "https://i.pravatar.cc/150?u=doc5"
  },
  {
    name: "ThS. BS. Đặng Thái Sơn",
    email: "thaison.dang@medicare.com",
    specialty: "Tim mạch",
    experience: "12 năm",
    gender: "Nam",
    address: "Hà Nội",
    description: "Tư vấn và điều trị rối loạn nhịp tim, bệnh lý van tim.",
    avatar: "https://i.pravatar.cc/150?u=doc6"
  },

  // Khoa Nội tổng quát (Miền Bắc)
  {
    name: "BS. CKII. Trịnh Văn Long",
    email: "vanlong.trinh@medicare.com",
    specialty: "Nội tổng quát",
    experience: "20 năm",
    gender: "Nam",
    address: "Hà Nội",
    description: "Khám và điều trị các bệnh lý nội khoa, nội tiết và tiêu hóa.",
    avatar: "https://i.pravatar.cc/150?u=doc7"
  },
  {
    name: "ThS. BS. Bùi Bích Ngọc",
    email: "bichngoc.bui@medicare.com",
    specialty: "Nội tổng quát",
    experience: "14 năm",
    gender: "Nữ",
    address: "Hà Nội",
    description: "Tầm soát sức khỏe tổng quát và điều trị tiểu đường, mỡ máu.",
    avatar: "https://i.pravatar.cc/150?u=doc8"
  },
  {
    name: "BS. CKI. Ngô Thế Ngọc",
    email: "thengoc.ngo@medicare.com",
    specialty: "Nội tổng quát",
    experience: "9 năm",
    gender: "Nam",
    address: "Hà Nội",
    description: "Nhiều năm kinh nghiệm trong khám nội thần kinh và hô hấp.",
    avatar: "https://i.pravatar.cc/150?u=doc9"
  },

  // Khoa Da liễu (Miền Nam)
  {
    name: "BS. CKII. Đinh Thị Lan Anh",
    email: "lananh.dinh@medicare.com",
    specialty: "Da liễu",
    experience: "16 năm",
    gender: "Nữ",
    address: "Hồ Chí Minh",
    description: "Chuyên điều trị các bệnh lý về da, viêm da cơ địa, và mụn trứng cá nặng.",
    avatar: "https://i.pravatar.cc/150?u=doc10"
  },
  {
    name: "ThS. BS. Hoàng Văn Dũng",
    email: "vandung.hoang@medicare.com",
    specialty: "Da liễu",
    experience: "11 năm",
    gender: "Nam",
    address: "Hồ Chí Minh",
    description: "Chuyên gia về thẩm mỹ nội khoa và điều trị sẹo, nám, tàn nhang.",
    avatar: "https://i.pravatar.cc/150?u=doc11"
  },
  {
    name: "BS. CKI. Nguyễn Thanh Thủy",
    email: "thanhthuy.nguyen@medicare.com",
    specialty: "Da liễu",
    experience: "7 năm",
    gender: "Nữ",
    address: "Hồ Chí Minh",
    description: "Khám và điều trị các bệnh lây nhiễm qua đường tình dục, nấm da.",
    avatar: "https://i.pravatar.cc/150?u=doc12"
  },

  // Khoa Cơ xương khớp (Miền Nam)
  {
    name: "PGS. TS. BS. Trần Hữu Khang",
    email: "huukhang.tran@medicare.com",
    specialty: "Cơ xương khớp",
    experience: "22 năm",
    gender: "Nam",
    address: "Hồ Chí Minh",
    description: "Chuyên gia phẫu thuật chỉnh hình và thay khớp nhân tạo.",
    avatar: "https://i.pravatar.cc/150?u=doc13"
  },
  {
    name: "BS. CKII. Lê Bích Thảo",
    email: "bichthao.le@medicare.com",
    specialty: "Cơ xương khớp",
    experience: "17 năm",
    gender: "Nữ",
    address: "Hồ Chí Minh",
    description: "Điều trị thoái hóa khớp, loãng xương và viêm khớp dạng thấp.",
    avatar: "https://i.pravatar.cc/150?u=doc14"
  },
  {
    name: "ThS. BS. Phan Trọng Tuấn",
    email: "trongtuan.phan@medicare.com",
    specialty: "Cơ xương khớp",
    experience: "10 năm",
    gender: "Nam",
    address: "Hồ Chí Minh",
    description: "Chuyên về y học thể thao và phục hồi chức năng sau chấn thương.",
    avatar: "https://i.pravatar.cc/150?u=doc15"
  },

  // Khoa Răng hàm mặt (Miền Nam)
  {
    name: "TS. BS. Nguyễn Đăng Khoa",
    email: "dangkhoa.nguyen@medicare.com",
    specialty: "Răng hàm mặt",
    experience: "19 năm",
    gender: "Nam",
    address: "Hồ Chí Minh",
    description: "Chuyên gia về cấy ghép Implant và nhổ răng khôn mọc ngầm.",
    avatar: "https://i.pravatar.cc/150?u=doc16"
  },
  {
    name: "ThS. BS. Vũ Thùy Linh",
    email: "thuylinh.vu@medicare.com",
    specialty: "Răng hàm mặt",
    experience: "12 năm",
    gender: "Nữ",
    address: "Hồ Chí Minh",
    description: "Chuyên chỉnh nha, niềng răng trong suốt và nha khoa thẩm mỹ.",
    avatar: "https://i.pravatar.cc/150?u=doc17"
  },
  {
    name: "BS. CKI. Phạm Quang Huy",
    email: "quanghuy.pham@medicare.com",
    specialty: "Răng hàm mặt",
    experience: "8 năm",
    gender: "Nam",
    address: "Hồ Chí Minh",
    description: "Khám và điều trị nha chu, bọc răng sứ và chữa tủy răng.",
    avatar: "https://i.pravatar.cc/150?u=doc18"
  }
];

async function main() {
  console.log('Đang tạo dữ liệu bác sĩ...');
  
  // Xóa toàn bộ lịch cũ để tránh sót lại lịch Thứ 7, CN từ lần chạy trước
  await prisma.doctorSchedule.deleteMany();

  // Hash password "123456"
  const passwordHash = await bcrypt.hash('123456', 10);

  // 1. Create specialties
  const specialtyMap = {};
  for (const name of specialties) {
    // Find or create
    let spec = await prisma.specialty.findFirst({
      where: { name }
    });
    if (!spec) {
      spec = await prisma.specialty.create({
        data: { name }
      });
    }
    specialtyMap[name] = spec.id;
  }

  // 2. Create doctors
  for (const [index, doc] of doctorsData.entries()) {
    const user = await prisma.user.upsert({
      where: { email: doc.email },
      update: {
        avatar: doc.avatar,
        gender: doc.gender,
        address: doc.address,
      },
      create: {
        fullName: doc.name,
        email: doc.email,
        passwordHash,
        role: 'DOCTOR',
        gender: doc.gender,
        address: doc.address,
        avatar: doc.avatar,
      },
    });

    const specialtyId = specialtyMap[doc.specialty];

    await prisma.doctorProfile.upsert({
      where: { userId: user.id },
      update: {
        specialtyId,
        experience: doc.experience,
        bio: doc.description,
      },
      create: {
        userId: user.id,
        specialtyId,
        experience: doc.experience,
        bio: doc.description,
        doctorCode: `BS-${user.id}`,
      },
    });

    const timeSlotsPool = ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];
    
    // Tạo lịch ngẫu nhiên cho 14 ngày (2 tuần, bao gồm cả thứ 2 đến chủ nhật)
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      
      // Xác định xem bác sĩ này có làm việc cuối tuần không (9 người làm, 9 người không)
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const worksOnWeekend = index % 2 === 0;
      
      // Bỏ qua Thứ 7, CN nếu bác sĩ này không làm việc cuối tuần
      if (isWeekend && !worksOnWeekend) {
        continue;
      }

      // Format as YYYY-MM-DD
      const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      
      // Bác sĩ làm full thời gian trong ngày (không random)
      const selectedSlots = [...timeSlotsPool];
      
      const existingSchedule = await prisma.doctorSchedule.findFirst({
        where: { doctorId: user.id, date: dateString }
      });
      
      if (existingSchedule) {
        await prisma.doctorSchedule.update({
          where: { id: existingSchedule.id },
          data: { timeSlots: selectedSlots }
        });
      } else {
        await prisma.doctorSchedule.create({
          data: {
            doctorId: user.id,
            date: dateString,
            timeSlots: selectedSlots
          }
        });
      }
    }

    console.log(`Đã tạo bác sĩ: ${doc.name} - ${doc.email} (${doc.address}) và xếp lịch ngẫu nhiên.`);
  }

  console.log('Hoàn thành việc tạo dữ liệu!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
