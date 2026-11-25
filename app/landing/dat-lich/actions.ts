'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { bookAppointment, BookingError, getBookableSchedules } from '@/lib/booking';

export interface BookingPayload {
  facilityId: number;
  specialtyId?: number;
  doctorId: number;
  scheduleId: number;
  patientId: number;
  bookingDate: string;
  bookingTime: string;
  phone?: string;
  reason?: string;
  requestId: string;
}

export async function getLandingAvailability(facilityId: number) {
  if (!Number.isSafeInteger(facilityId) || facilityId <= 0) {
    return { success: false, schedules: [], message: 'Vui lòng chọn cơ sở khám.' };
  }
  try {
    return { success: true, schedules: await getBookableSchedules(facilityId) };
  } catch (error) {
    console.error('Không thể tải lịch trực:', error);
    return { success: false, schedules: [], message: 'Không thể tải lịch khám. Vui lòng thử lại.' };
  }
}

export async function createLandingAppointment(payload: BookingPayload) {
  try {
    const cookieStore = await cookies();
    const userId = Number(cookieStore.get('user_id')?.value);
    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return { success: false, requireAuth: true, message: 'Vui lòng đăng nhập để xác nhận lịch khám.' };
    }
    if (!Number.isSafeInteger(payload.facilityId) || payload.facilityId <= 0 || !Number.isSafeInteger(payload.scheduleId) || payload.scheduleId <= 0) {
      return { success: false, message: 'Vui lòng chọn cơ sở và ca khám.' };
    }
    const appointment = await bookAppointment({
      bookedById: userId, patientId: payload.patientId, doctorId: payload.doctorId,
      facilityId: payload.facilityId, specialtyId: payload.specialtyId, scheduleId: payload.scheduleId,
      date: payload.bookingDate, time: payload.bookingTime, phone: payload.phone,
      reason: payload.reason, requestId: payload.requestId,
    });

    // Notification failure must not turn a committed booking into a failed one.
    try {
      const notification = await prisma.notification.findFirst({
        where: { userId, type: 'APPOINTMENT', message: { contains: appointment.appointmentCode! } },
        select: { id: true },
      });
      if (!notification) await prisma.notification.create({
        data: {
          userId, title: 'Đặt lịch khám thành công', type: 'APPOINTMENT', link: '/patient/my-appointments',
          message: `Mã lịch hẹn: ${appointment.appointmentCode}. Người khám: ${appointment.patient.fullName}. Ngày ${appointment.bookingDate}, lúc ${appointment.bookingTime}. Bác sĩ: ${appointment.doctor.fullName}. ${appointment.room || ''}`,
        },
      });
    } catch (error) { console.warn('Không thể tạo thông báo đặt lịch:', error); }

    for (const path of ['/landing/dat-lich', '/patient/appointments', '/patient/my-appointments', '/receptionist/appointments', '/admin/appointments']) {
      revalidatePath(path);
    }
    return {
      success: true,
      details: {
        appointmentCode: appointment.appointmentCode!, patientName: appointment.patient.fullName,
        phone: appointment.patient.phone || '', bookingDate: appointment.bookingDate, bookingTime: appointment.bookingTime,
        doctorName: appointment.doctor.fullName, specialty: appointment.specialty,
        facilityName: appointment.room?.split(' - ')[0] || '', room: appointment.room || '',
      },
    };
  } catch (error) {
    if (error instanceof BookingError) {
      return {
        success: false, message: error.message, requireAuth: error.code === 'AUTH_REQUIRED',
        refreshAvailability: ['SLOT_UNAVAILABLE', 'DAILY_LIMIT'].includes(error.code),
      };
    }
    console.error('Lỗi đặt lịch khám:', error);
    return { success: false, message: 'Không thể hoàn tất đặt lịch lúc này. Vui lòng thử lại.' };
  }
}
