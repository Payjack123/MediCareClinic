const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function updateScheduleFormats() {
  const schedules = await prisma.doctorSchedule.findMany();
  let updatedCount = 0;

  for (const schedule of schedules) {
    try {
      let timeSlots = typeof schedule.timeSlots === 'string' ? JSON.parse(schedule.timeSlots) : schedule.timeSlots;
      if (!Array.isArray(timeSlots)) continue;

      let modified = false;
      const newTimeSlots = timeSlots.map(slot => {
        if (slot.includes(' - ')) {
          modified = true;
          return slot.split(' - ')[0].trim();
        }
        return slot;
      });

      if (modified) {
        await prisma.doctorSchedule.update({
          where: { id: schedule.id },
          data: { timeSlots: JSON.stringify(newTimeSlots) }
        });
        updatedCount++;
      }
    } catch (e) {
      console.error(`Error updating schedule ${schedule.id}:`, e);
    }
  }

  console.log(`Successfully updated formats in ${updatedCount} schedules.`);
}

updateScheduleFormats()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
