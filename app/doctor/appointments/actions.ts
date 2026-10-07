'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getMySchedules(year: number, month: number) {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    const doctorId = parseInt(userIdStr);

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: doctorId },
      include: { specialty: true }
    });

    if (!doctorProfile) {
      return { success: false, schedules: [] };
    }

    // Format start and end date for the month (YYYY-MM-DD)
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const startStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-01`;
    const endStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

    // Get schedules
    const schedules = await prisma.doctorSchedule.findMany({
      where: { 
        doctorId: doctorProfile.userId,
        date: {
          gte: startStr,
          lte: endStr
        }
      },
      orderBy: { date: 'asc' },
      include: { 
        clinic: {
          include: { facility: true }
        }
      }
    });

    // Get appointments for the doctor in this month
    // Appointments have bookingDate in DD/MM/YYYY format
    // We fetch all appointments for the doctor and filter in memory since string format doesn't allow easy DB filtering by month
    const allAppointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctorId
      },
      include: {
        patient: true
      }
    });

    const monthStr = String(month).padStart(2, '0');
    const yearStr = String(year);

    const monthAppointments = allAppointments.filter(apt => {
       const parts = apt.bookingDate.split('/');
       return parts[1] === monthStr && parts[2] === yearStr;
    });

    // Format the schedules to include appointment stats
    const formattedSchedules = schedules.map(schedule => {
      // Convert schedule.date (YYYY-MM-DD) to DD/MM/YYYY
      const parts = schedule.date.split('-');
      const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;

      // Get appointments for this day
      const dayAppointments = monthAppointments.filter(apt => apt.bookingDate === formattedDate);

      // Now we might have multiple time slots in the schedule.timeSlots
      // The requirement treats a "Ca khám" (Shift) as a combination of Date and a block of time.
      // But DoctorSchedule stores timeSlots like ["08:00", "08:30", "09:00"]. 
      // We'll summarize it as one shift for the day (e.g., 08:00 - 10:00).
      let timeSlots = [];
      try {
        timeSlots = typeof schedule.timeSlots === 'string' ? JSON.parse(schedule.timeSlots) : schedule.timeSlots;
      } catch (e) {
        timeSlots = [];
      }
      
      let shiftTime = 'N/A';
      if (Array.isArray(timeSlots) && timeSlots.length > 0) {
        const sorted = [...timeSlots].sort();
        const firstSlot = sorted[0];
        const lastSlot = sorted[sorted.length - 1];
        const startTime = firstSlot.includes(' - ') ? firstSlot.split(' - ')[0] : firstSlot;
        const endTime = lastSlot.includes(' - ') ? lastSlot.split(' - ')[1] : lastSlot;
        shiftTime = `${startTime} - ${endTime}`;
      }

      // Check shift status based on today
      const today = new Date();
      today.setHours(0,0,0,0);
      const scheduleDateObj = new Date(schedule.date);
      
      let shiftStatus = 'Sắp diễn ra';
      if (scheduleDateObj < today) shiftStatus = 'Đã kết thúc';
      else if (scheduleDateObj.getTime() === today.getTime()) shiftStatus = 'Đang hoạt động';

      // Appointments summary
      let totalApt = dayAppointments.length;
      let completedApt = 0;
      let examiningApt = 0;
      let waitingApt = 0;

      const aptDetails = dayAppointments.map(apt => {
         if (apt.status === 'Đã khám') completedApt++;
         else if (apt.status === 'Đang khám') examiningApt++;
         else if (apt.status !== 'Đã hủy' && apt.status !== 'Không đến') waitingApt++;

         return {
           id: apt.id,
           code: apt.appointmentCode || `LH-${apt.id}`,
           patientName: apt.patient.fullName,
           status: apt.status
         };
      });

      return {
        id: schedule.id,
        date: schedule.date, // YYYY-MM-DD
        formattedDate, // DD/MM/YYYY
        shiftTime,
        room: schedule.clinic?.roomNumber ? `P. ${schedule.clinic.roomNumber}` : (schedule.clinic?.name || 'P. Khám'),
        facility: schedule.clinic?.facility?.name || schedule.clinic?.name || 'Cơ sở chính',
        specialty: doctorProfile.specialty?.name || 'Đa khoa',
        status: shiftStatus, // Đang hoạt động, Sắp diễn ra, Đã kết thúc, Hủy
        stats: {
          total: totalApt,
          completed: completedApt,
          examining: examiningApt,
          waiting: waitingApt
        },
        appointments: aptDetails
      };
    });

    return { success: true, schedules: formattedSchedules };
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return { success: false, schedules: [] };
  }
}
