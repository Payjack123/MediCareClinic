// Fix appointment data
const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const apts = await prisma.appointment.findMany({
    orderBy: { id: 'desc' },
    take: 4
  });

  const reasons = ['Khám đau dạ dày', 'Tầm soát tim mạch', 'Đau đầu mất ngủ', 'Khám sức khỏe tổng quát'];
  const specialties = ['Nội tiêu hóa', 'Tim mạch', 'Thần kinh', 'Nội tổng quát'];

  for (let i = 0; i < apts.length; i++) {
    const apt = apts[i];
    
    // The parsing logic expects: "Người khám: ... - SĐT: ... Lý do: [reason]"
    let newReason = apt.reason;
    if (newReason && newReason.includes('. Lý do: ')) {
       const parts = newReason.split('. Lý do: ');
       newReason = parts[0] + '. Lý do: ' + reasons[i % reasons.length];
    } else {
       newReason = 'Người khám: ' + apt.patientId + '. Lý do: ' + reasons[i % reasons.length];
    }

    await prisma.appointment.update({
      where: { id: apt.id },
      data: { 
        specialty: specialties[i % specialties.length],
        reason: newReason
      }
    });
  }
  
  console.log('Updated 4 appointments!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
