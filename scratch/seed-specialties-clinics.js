const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  const specialties = [
    { name: 'Nội tổng quát', iconType: 'Stethoscope', desc: 'Kiểm tra sức khỏe tổng quát, tầm soát bệnh lý...' },
    { name: 'Tim mạch', iconType: 'HeartPulse', desc: 'Khám và điều trị các bệnh lý về tim mạch, huyết áp...' },
    { name: 'Da liễu', iconType: 'Smile', desc: 'Các triệu chứng ngoài da: ngứa, mụn, phỏng nước...' },
    { name: 'Răng hàm mặt', iconType: 'Activity', desc: 'Nhổ răng, trám răng, điều trị tủy, niềng răng...' },
    { name: 'Cơ xương khớp', iconType: 'Bone', desc: 'Khám các bệnh lý về xương khớp, đau lưng, thoái hóa...' },
    { name: 'Mắt', iconType: 'Eye', desc: 'Đo khúc xạ, điều trị các bệnh lý về mắt, đục thủy tinh thể...' }
  ];

  // Các cơ sở y tế
  const facilities = await prisma.facility.findMany();
  if (facilities.length === 0) {
    console.log("Không có cơ sở y tế nào. Hãy tạo cơ sở trước.");
    return;
  }
  
  for (const facility of facilities) {
    const targetFacilityId = facility.id;
    for (const spec of specialties) {
      let specialtyRecord = await prisma.specialty.findFirst({ where: { name: spec.name } });
      
      if (!specialtyRecord) {
        specialtyRecord = await prisma.specialty.create({
          data: {
            name: spec.name,
            description: spec.desc,
            iconType: spec.iconType
          }
        });
        console.log(`Đã tạo chuyên khoa: ${spec.name}`);
      }

      // Tạo 2-3 phòng khám cho chuyên khoa này tại cơ sở này
      const clinicsToCreate = [
        { name: `Phòng khám ${spec.name} 1 (P.${Math.floor(Math.random() * 5 + 1)}0${Math.floor(Math.random() * 9 + 1)} Nhà A - ${facility.name.includes('HÀ NỘI') ? 'HN' : 'HCM'})`, type: spec.name },
        { name: `Phòng khám ${spec.name} VIP (P.${Math.floor(Math.random() * 5 + 1)}0${Math.floor(Math.random() * 9 + 1)} Nhà K1 - ${facility.name.includes('HÀ NỘI') ? 'HN' : 'HCM'})`, type: spec.name }
      ];

      for (const c of clinicsToCreate) {
        const existingClinic = await prisma.clinic.findFirst({ where: { name: c.name } });
        if (!existingClinic) {
          await prisma.clinic.create({
            data: {
              name: c.name,
              type: c.type,
              facilityId: targetFacilityId
            }
          });
          console.log(`  + Đã tạo phòng khám: ${c.name} tại ${facility.name}`);
        }
      }
    }
  }

  console.log('Hoàn tất tạo chuyên khoa và phòng khám mẫu!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
