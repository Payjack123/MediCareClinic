const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  const clinics = await prisma.clinic.findMany();
  
  for (let i = 0; i < clinics.length; i++) {
    const clinic = clinics[i];
    
    // Tạo room và building ngẫu nhiên hoặc theo quy luật
    const floor = Math.floor(Math.random() * 5) + 1; // Tầng 1-5
    const room = String(Math.floor(Math.random() * 20) + 1).padStart(2, '0');
    const roomName = `P.${floor}${room}`;
    
    const buildings = ['K1', 'K2', 'A', 'B', 'C'];
    const building = buildings[Math.floor(Math.random() * buildings.length)];

    let baseName = clinic.name;
    
    // Xóa hậu tố "(Medicare Hà Nội)" hoặc "(Medicare Hồ Chí Minh)" cũ nếu có
    baseName = baseName.replace(/\s*\(.*?\)\s*/g, '');
    
    // Đảm bảo tên bắt đầu bằng "PK" hoặc "Phòng khám"
    if (!baseName.toLowerCase().startsWith('pk') && !baseName.toLowerCase().startsWith('phòng khám')) {
      baseName = `Phòng khám ${baseName}`;
    }

    const newName = `${baseName} (${roomName} Nhà ${building})`;

    await prisma.clinic.update({
      where: { id: clinic.id },
      data: { name: newName }
    });
    
    console.log(`Đã đổi tên: ${clinic.name} -> ${newName}`);
  }

  console.log('Hoàn tất đổi tên tất cả phòng khám!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
