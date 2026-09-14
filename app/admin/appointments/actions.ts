'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import dayjs from 'dayjs';

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
      // Expected date format 'YYYY-MM-DD', DB stores as 'DD/MM/YYYY' or 'YYYY-MM-DD' depending on convention
      // Let's assume DB stores as 'DD/MM/YYYY' since that's what we used in creating previously or we can check the format
      // Let's just pass whatever the input is directly if it matches the format, 
      // but usually the DB has string bookingDate
      whereClause.bookingDate = filters.date; 
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
      include: { doctorProfile: true },
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
}) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    // Tự sinh mã lịch hẹn: LH[YYMMDD]-[PatientID]
    const dateParts = data.bookingDate.split('/'); // DD/MM/YYYY
    let shortDate = dayjs().format('YYMMDD');
    if (dateParts.length === 3) {
      shortDate = `${dateParts[2].slice(-2)}${dateParts[1]}${dateParts[0]}`;
    }
    
    // To ensure uniqueness, add random suffix if needed, but patientId + date should be unique enough for one day.
    // We can just append a small random number or the count for that day.
    const countToday = await prisma.appointment.count({
      where: { bookingDate: data.bookingDate }
    });
    
    const code = `LH${shortDate}-${String(data.patientId).padStart(4, '0')}-${countToday + 1}`;

    const newAppointment = await prisma.appointment.create({
      data: {
        appointmentCode: code,
        patientId: data.patientId,
        doctorId: data.doctorId,
        specialty: data.specialty,
        bookingDate: data.bookingDate,
        bookingTime: data.bookingTime,
        room: data.room || 'Chưa xếp',
        reason: data.reason || '',
        status: 'Đã đặt'
      }
    });

    return { success: true, data: newAppointment, message: 'Tạo lịch hẹn thành công' };
  } catch (error) {
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