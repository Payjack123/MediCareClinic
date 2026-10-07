'use server';

import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function getDoctors() {
  try {
    const doctors = await prisma.user.findMany({
      where: { role: 'DOCTOR' },
      include: {
        doctorProfile: {
          include: { specialty: true }
        }
      }
    });

    return {
      success: true,
      doctors: doctors.map(d => ({
        id: d.id,
        name: d.fullName,
        specialty: d.doctorProfile?.specialty?.name || 'Đa khoa',
        address: d.address || ''
      }))
    };
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return { success: false, doctors: [] };
  }
}

export async function getDoctorSchedules(doctorId: number, month: number, year: number) {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const startStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-01`;
    const endStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

    const schedules = await prisma.doctorSchedule.findMany({
      where: {
        doctorId,
        date: {
          gte: startStr,
          lte: endStr
        }
      },
      orderBy: { date: 'asc' }
    });

    return { success: true, schedules: schedules.map(s => {
      let parsedTimeSlots = [];
      try {
        parsedTimeSlots = typeof s.timeSlots === 'string' ? JSON.parse(s.timeSlots) : s.timeSlots;
      } catch (e) {
        parsedTimeSlots = [];
      }
      return {
        id: s.id,
        date: s.date,
        clinicId: s.clinicId,
        timeSlots: Array.isArray(parsedTimeSlots) ? parsedTimeSlots : []
      };
    })};
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return { success: false, schedules: [] };
  }
}

export async function getClinics() {
  try {
    const clinics = await prisma.clinic.findMany({
      include: { facility: true, specialty: true }
    });
    return { success: true, clinics };
  } catch (error) {
    console.error('Error fetching clinics:', error);
    return { success: false, clinics: [] };
  }
}

export async function assignSchedule(doctorId: number, date: string, timeSlots: string[], clinicId?: number | null) {
  try {
    const existing = await prisma.doctorSchedule.findFirst({
      where: { doctorId, date }
    });

    const timeSlotsJson = JSON.stringify(timeSlots);

    if (existing) {
      if (timeSlots.length === 0) {
        await prisma.doctorSchedule.delete({ where: { id: existing.id } });
      } else {
        await prisma.doctorSchedule.update({
          where: { id: existing.id },
          data: { 
            timeSlots: timeSlotsJson,
            clinicId: clinicId || existing.clinicId
          }
        });
      }
    } else {
      if (timeSlots.length > 0) {
        await prisma.doctorSchedule.create({
          data: {
            doctorId,
            date,
            timeSlots: timeSlotsJson,
            clinicId: clinicId || null
          }
        });
      }
    }

    return { success: true, message: 'Đã lưu ca khám thành công' };
  } catch (error) {
    console.error('Error assigning schedule:', error);
    return { success: false, message: 'Đã xảy ra lỗi' };
  }
}
