const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const docs = await prisma.doctorProfile.findMany({
    include: {
      user: true,
      clinics: true,
      specialty: true
    }
  });

  const facilities = await prisma.facility.findMany();
  const defaultFacilityId = facilities.length > 0 ? facilities[0].id : null;

  if (!defaultFacilityId) {
    console.log("No facilities found!");
    return;
  }

  for (const doc of docs) {
    if (doc.clinics.length === 0 && doc.specialtyId) {
      console.log(`Đang xử lý: ${doc.user.fullName} (${doc.specialty?.name})`);
      
      // Find clinics that match this specialty
      let clinics = await prisma.clinic.findMany({
        where: { specialtyId: doc.specialtyId }
      });

      // If no clinic exists for this specialty, create one
      if (clinics.length === 0) {
        const newClinic = await prisma.clinic.create({
          data: {
            name: `Phòng khám ${doc.specialty?.name || 'Đa khoa'}`,
            roomNumber: `P.10${Math.floor(Math.random() * 9)}`,
            type: doc.specialty?.name || 'Đa khoa',
            facilityId: defaultFacilityId,
            specialtyId: doc.specialtyId
          }
        });
        clinics = [newClinic];
        console.log(`-> Tạo mới: ${newClinic.name}`);
      }

      // Assign the doctor to the first matched clinic
      await prisma.doctorProfile.update({
        where: { id: doc.id },
        data: {
          clinics: {
            connect: { id: clinics[0].id }
          }
        }
      });
      
      console.log(`-> Đã gắn vào: ${clinics[0].name}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
