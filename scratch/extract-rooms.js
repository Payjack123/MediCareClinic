const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const clinics = await prisma.clinic.findMany();
  for (const c of clinics) {
    const match = c.name.match(/\((.*?)\)/); // match anything inside parentheses
    if (match) {
      const roomNumber = match[1]; // e.g. "P.106 Nhà A"
      let newName = c.name.replace(/\(.*?\)/, '').trim(); // e.g. "Phòng khám Nội tổng quát 1"
      
      await prisma.clinic.update({
        where: { id: c.id },
        data: { name: newName, roomNumber: roomNumber }
      });
      console.log(`Updated ${c.name} -> Name: '${newName}', Room: '${roomNumber}'`);
    } else {
      console.log(`Skipped ${c.name} (No room pattern matched)`);
    }
  }
}
main().finally(() => prisma.$disconnect());
