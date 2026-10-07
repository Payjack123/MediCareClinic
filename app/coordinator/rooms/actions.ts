'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function changeDoctorScheduleRoomAction(scheduleId: number, newClinicId: number) {
  try {
    const schedule = await prisma.doctorSchedule.findUnique({ where: { id: scheduleId } });
    if (!schedule) return { success: false, message: 'Không tìm thấy lịch khám!' };

    // Kiểm tra trùng phòng
    const existingClinic = await prisma.doctorSchedule.findFirst({
      where: {
        clinicId: newClinicId,
        date: schedule.date,
        id: { not: scheduleId }
      }
    });

    if (existingClinic) {
      return { success: false, message: 'Phòng này đã có bác sĩ khác trực trong ngày hôm nay!' };
    }

    await prisma.doctorSchedule.update({
      where: { id: scheduleId },
      data: { clinicId: newClinicId }
    });

    revalidatePath('/coordinator/rooms');
    revalidatePath('/coordinator/appointments');
    revalidatePath('/coordinator/dashboard');
    return { success: true, message: 'Đổi phòng thành công!' };
  } catch (error) {
    console.error('Error changing room:', error);
    return { success: false, message: 'Lỗi hệ thống khi đổi phòng!' };
  }
}

export async function cancelDoctorScheduleAction(scheduleId: number) {
  try {
    // Nếu có lịch hẹn (Appointment) thì không cho xóa, hoặc phải xử lý
    const bookingsCount = await prisma.appointment.count({
      where: { doctorId: (await prisma.doctorSchedule.findUnique({where:{id:scheduleId}}))?.doctorId, bookingDate: (await prisma.doctorSchedule.findUnique({where:{id:scheduleId}}))?.date }
    });

    if (bookingsCount > 0) {
      return { success: false, message: `Không thể hủy! Đang có ${bookingsCount} bệnh nhân đặt lịch trong ca này.` };
    }

    await prisma.doctorSchedule.delete({
      where: { id: scheduleId }
    });

    revalidatePath('/coordinator/rooms');
    revalidatePath('/coordinator/appointments');
    revalidatePath('/coordinator/dashboard');
    return { success: true, message: 'Hủy phân phòng thành công!' };
  } catch (error) {
    console.error('Error canceling schedule:', error);
    return { success: false, message: 'Lỗi hệ thống khi hủy phân phòng!' };
  }
}
