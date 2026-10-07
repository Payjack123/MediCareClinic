const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function removeExtraEveningSchedules() {
  const schedules = await prisma.doctorSchedule.findMany();
  let updatedCount = 0;

  for (const schedule of schedules) {
    try {
      let timeSlots = typeof schedule.timeSlots === 'string' ? JSON.parse(schedule.timeSlots) : schedule.timeSlots;
      if (!Array.isArray(timeSlots)) continue;

      const extraSlots = ["18:30 - 19:00", "19:00 - 19:30", "19:30 - 20:00"];
      let modified = false;

      for (const slot of extraSlots) {
        const index = timeSlots.indexOf(slot);
        if (index !== -1) {
          timeSlots.splice(index, 1);
          modified = true;
        }
      }

      if (modified) {
        await prisma.doctorSchedule.update({
          where: { id: schedule.id },
          data: { timeSlots: JSON.stringify(timeSlots) }
        });
        updatedCount++;
      }
    } catch (e) {
      console.error(`Error updating schedule ${schedule.id}:`, e);
    }
  }

  console.log(`Successfully removed extra evening slots from ${updatedCount} schedules.`);
}

removeExtraEveningSchedules()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
