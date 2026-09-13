'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Lấy danh sách lịch hẹn với bộ lọc
export async function getAppointments(dateStr: string, search: string, statusFilter: string) {
  try {
    let whereClause: any = {};
    
    // Lọc theo ngày (mặc định hôm nay nếu không có)
    if (dateStr) {
      whereClause.bookingDate = dateStr;
    }

    // Lọc theo trạng thái
    if (statusFilter && statusFilter !== 'ALL') {
      whereClause.status = statusFilter;
    }

    // Lọc theo tìm kiếm (Mã lịch hẹn, tên bệnh nhân, SĐT, Mã bệnh nhân)
    if (search) {
      whereClause.OR = [
        { appointmentCode: { contains: search } },
        {
          patient: {
            OR: [
              { fullName: { contains: search } },
              { phone: { contains: search } },
              { patientProfile: { patientCode: { contains: search } } }
            ]
          }
        },
        { reason: { contains: search } } // Có thể tìm trong lý do (chứa tên người thân)
      ];
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: {
          include: { patientProfile: true }
        },
        doctor: true
      },
      orderBy: [
        { bookingDate: 'desc' },
        { bookingTime: 'asc' }
      ]
    });

    // Format dữ liệu trả về cho UI
    const formattedData = appointments.map((apt: any) => {
      let displayPatientName = apt.patient.fullName;
      let displayPhone = apt.patient.phone || 'Chưa cập nhật';
      let patientCode = apt.patient.patientProfile?.patientCode || 'Chưa cập nhật';
      
      // Xử lý logic người thân
      if (apt.reason && apt.reason.startsWith('Người khám:')) {
        const nameMatch = apt.reason.match(/Người khám: (.*?) - Mã BN:/);
        if (nameMatch) displayPatientName = nameMatch[1].trim();
        const codeMatch = apt.reason.match(/- Mã BN: (.*?) - CCCD:/);
        if (codeMatch) {
          patientCode = codeMatch[1].trim();
          if (patientCode === 'Không có') patientCode = 'Chưa cập nhật';
        }
        const phoneMatch = apt.reason.match(/- SĐT: (.*?) - ĐC:/);
        if (phoneMatch) displayPhone = phoneMatch[1].trim();
      }

      return {
        id: apt.id,
        appointmentCode: apt.appointmentCode || `LH${apt.bookingDate.replace(/\//g, '').substring(0, 6)}-${String(apt.id).padStart(5, '0')}`,
        patientCode: patientCode,
        patientName: displayPatientName,
        phone: displayPhone,
        bookingDate: apt.bookingDate,
        bookingTime: apt.bookingTime,
        doctorName: `BS. ${apt.doctor.fullName}`,
        specialty: apt.specialty,
        status: apt.status,
        reason: apt.reason || 'Không có',
        createdAt: apt.createdAt
      };
    });

    return { success: true, data: formattedData };
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lịch hẹn:', error);
    return { success: false, data: [], message: 'Đã xảy ra lỗi' };
  }
}

// Cập nhật trạng thái lịch hẹn
export async function updateAppointmentStatus(appointmentId: number, newStatus: string) {
  try {
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: newStatus }
    });
    
    revalidatePath('/receptionist/appointments');
    return { success: true, message: 'Cập nhật thành công' };
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error);
    return { success: false, message: 'Không thể cập nhật trạng thái' };
  }
}
