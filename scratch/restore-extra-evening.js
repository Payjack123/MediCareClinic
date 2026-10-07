const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function addExtraEveningSchedules() {
  const schedules = await prisma.doctorSchedule.findMany();
  let updatedCount = 0;

  for (const schedule of schedules) {
    try {
      let timeSlots = typeof schedule.timeSlots === 'string' ? JSON.parse(schedule.timeSlots) : schedule.timeSlots;
      if (!Array.isArray(timeSlots)) continue;

      const extraSlots = ["18:30 - 19:00", "19:00 - 19:30", "19:30 - 20:00"];
      let modified = false;

      for (const slot of extraSlots) {
        if (!timeSlots.includes(slot)) {
          timeSlots.push(slot);
          modified = true;
        }
      }

      if (modified) {
        timeSlots.sort((a, b) => {
          const timeA = parseInt(a.split(':')[0]) * 60 + parseInt(a.split(':')[1]);
          const timeB = parseInt(b.split(':')[0]) * 60 + parseInt(b.split(':')[1]);
          return timeA - timeB;
        });

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

  console.log(`Successfully added extra evening slots to ${updatedCount} schedules.`);
}

addExtraEveningSchedules()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
