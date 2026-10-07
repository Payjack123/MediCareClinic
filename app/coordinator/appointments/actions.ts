'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createDoctorScheduleAction(data: {
  doctorId: number;
  clinicId: number;
  date: string;
  timeSlots: string[];
}) {
  try {
    const existingDoctor = await prisma.doctorSchedule.findFirst({
      where: { doctorId: data.doctorId, date: data.date }
    });
    if (existingDoctor) return { success: false, message: 'Bác sĩ này đã có lịch trực trong ngày hôm nay!' };

    const existingClinic = await prisma.doctorSchedule.findFirst({
      where: { clinicId: data.clinicId, date: data.date }
    });
    if (existingClinic) return { success: false, message: 'Phòng khám này đã được phân công cho bác sĩ khác!' };

    await prisma.doctorSchedule.create({
      data: {
        doctorId: data.doctorId,
        clinicId: data.clinicId,
        date: data.date,
        timeSlots: data.timeSlots,
      }
    });

    revalidatePath('/coordinator/appointments');
    revalidatePath('/coordinator/dashboard');
    return { success: true, message: 'Lưu lịch khám thành công!' };
  } catch (error) {
    console.error('Error creating schedule:', error);
    return { success: false, message: 'Đã xảy ra lỗi hệ thống khi lưu lịch khám.' };
  }
}

export async function createWeeklySchedulesAction(data: {
  doctorId: number;
  clinicId: number;
  dates: string[]; // ['2026-10-01', '2026-10-03', ...]
  timeSlots: string[];
}) {
  try {
    let successCount = 0;
    let skipCount = 0;

    for (const date of data.dates) {
      // Check trùng
      const existing = await prisma.doctorSchedule.findFirst({
        where: {
          OR: [
            { doctorId: data.doctorId, date: date },
            { clinicId: data.clinicId, date: date }
          ]
        }
      });

      if (!existing) {
        await prisma.doctorSchedule.create({
          data: {
            doctorId: data.doctorId,
            clinicId: data.clinicId,
            date: date,
            timeSlots: data.timeSlots,
          }
        });
        successCount++;
      } else {
        skipCount++;
      }
    }

    revalidatePath('/coordinator/appointments');
    revalidatePath('/coordinator/rooms');
    return { 
      success: true, 
      message: `Đã tạo thành công ${successCount} ngày. Bỏ qua ${skipCount} ngày do trùng lịch.` 
    };
  } catch (error) {
    console.error('Error batch creating schedules:', error);
    return { success: false, message: 'Đã xảy ra lỗi hệ thống khi tạo lịch tuần.' };
  }
}
