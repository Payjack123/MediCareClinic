'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { bookAppointment, BookingError } from '@/lib/booking';
import { bookingDateAliases } from '@/lib/booking-utils';
import { revalidatePath } from 'next/cache';

export async function getAppointments(filters?: { search?: string, date?: string, status?: string }) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    const whereClause: any = {};

    if (filters?.search) {
      whereClause.OR = [
        { appointmentCode: { contains: filters.search } },
        { patient: { fullName: { contains: filters.search } } },
        { patient: { phone: { contains: filters.search } } },
        { patient: { patientProfile: { patientCode: { contains: filters.search } } } }
      ];
    }

    if (filters?.date) {
      whereClause.bookingDate = { in: bookingDateAliases(filters.date) };
    }

    if (filters?.status) {
      whereClause.status = filters.status;
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: { include: { patientProfile: true } },
        doctor: { include: { doctorProfile: true } }
      },
      orderBy: [
        { bookingDate: 'desc' },
        { bookingTime: 'asc' }
      ]
    });

    return { success: true, data: appointments };
  } catch (error) {
    console.error("Lỗi lấy danh sách lịch hẹn:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function getInitialDataForCreate() {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    const patients = await prisma.user.findMany({
      where: { role: 'PATIENT', status: 'Hoạt động' },
      include: { patientProfile: true },
      orderBy: { fullName: 'asc' }
    });

    const doctors = await prisma.user.findMany({
      where: { role: 'DOCTOR' },
      include: { doctorProfile: { include: { specialty: true } } },
      orderBy: { fullName: 'asc' }
    });

    return { success: true, data: { patients, doctors } };
  } catch (error) {
    console.error("Lỗi lấy dữ liệu khởi tạo:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function createAppointment(data: {
  patientId: number;
  doctorId: number;
  specialty: string;
  bookingDate: string; // DD/MM/YYYY
  bookingTime: string; // 08:00 - 10:00
  room?: string;
  reason?: string;
  overrideLimit?: boolean;
}) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    const newAppointment = await bookAppointment({
      bookedById: Number(cookieStore.get('user_id')?.value), patientId: Number(data.patientId), doctorId: Number(data.doctorId),
      specialty: data.specialty, date: data.bookingDate, time: data.bookingTime,
      room: data.room, reason: data.reason, admin: true, overrideLimit: data.overrideLimit,
    });
    for (const path of ['/landing/dat-lich', '/patient/appointments', '/receptionist/appointments', '/admin/appointments']) revalidatePath(path);
    return { success: true, data: newAppointment, message: 'Tạo lịch hẹn thành công' };
  } catch (error) {
    if (error instanceof BookingError) return { success: false, message: error.message, requiresOverride: error.code === 'DAILY_LIMIT' };
    console.error("Lỗi tạo lịch hẹn:", error);
    return { success: false, message: 'Lỗi máy chủ khi tạo lịch hẹn' };
  }
}

export async function getAppointmentById(id: number) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: { include: { patientProfile: true } },
        doctor: { include: { doctorProfile: true } },
      }
    });

    if (!appointment) return { success: false, message: 'Không tìm thấy lịch hẹn' };

    return { success: true, data: appointment };
  } catch (error) {
    console.error("Lỗi lấy thông tin lịch hẹn:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function updateAppointmentStatus(id: number, status: string) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    await prisma.appointment.update({
      where: { id },
      data: { status }
    });

    return { success: true, message: `Chuyển trạng thái thành ${status}` };
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái lịch hẹn:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}
