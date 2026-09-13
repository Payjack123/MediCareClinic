'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// 1. Get all checked-in appointments (status: 'ĐÃ XÁC NHẬN')
export async function getCheckedInAppointments(dateStr: string) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        bookingDate: dateStr,
        status: { in: ['ĐÃ XÁC NHẬN', 'ĐÃ CẤP SỐ'] } // Only patients who have checked in or already have a queue number
      },
      include: {
        patient: {
          include: {
            patientProfile: true
          }
        },
        doctor: true
      },
      orderBy: [
        { bookingTime: 'asc' } // Sorted by booking time
      ]
    });

    const result = await Promise.all(appointments.map(async (appointment: any) => {
      let displayPatientName = appointment.patient.fullName;
      let displayPhone = appointment.patient.phone || 'Chưa cập nhật';
      let displayCccd = appointment.patient.patientProfile?.cccd || 'Chưa cập nhật';
      let isForRelative = false;
      let extractedPatientCode = 'Chưa cập nhật';

      if (appointment.reason && appointment.reason.startsWith('Người khám:')) {
        isForRelative = true;
        const nameMatch = appointment.reason.match(/Người khám: (.*?) - Mã BN:/);
        if (nameMatch) displayPatientName = nameMatch[1].trim();

        const codeMatch = appointment.reason.match(/- Mã BN: (.*?) - CCCD:/);
        if (codeMatch) {
          extractedPatientCode = codeMatch[1].trim();
          if (extractedPatientCode === 'Không có') extractedPatientCode = 'Chưa cập nhật';
        }

        const cccdMatch = appointment.reason.match(/- CCCD: (.*?) - SĐT:/);
        if (cccdMatch) {
          const extractedCccd = cccdMatch[1].trim();
          displayCccd = extractedCccd === 'Không có' ? 'Chưa cập nhật' : extractedCccd;
        }

        const phoneMatch = appointment.reason.match(/- SĐT: (.*?) - ĐC:/);
        if (phoneMatch) displayPhone = phoneMatch[1].trim();
      }

      let finalGender = isForRelative ? 'Chưa cập nhật' : (appointment.patient.gender || 'Chưa cập nhật');
      let finalDob = isForRelative ? 'Chưa cập nhật' : (appointment.patient.dob || 'Chưa cập nhật');
      let finalPatientCode = isForRelative ? extractedPatientCode : (appointment.patient.patientProfile?.patientCode || 'Chưa cập nhật');

      // Fetch relative details if possible
      if (isForRelative && extractedPatientCode !== 'Chưa cập nhật') {
        try {
          const relativeUser = await prisma.user.findFirst({
            where: { patientProfile: { patientCode: extractedPatientCode } }
          });
          if (relativeUser) {
            finalGender = relativeUser.gender || 'Chưa cập nhật';
            finalDob = relativeUser.dob || 'Chưa cập nhật';
          }
        } catch (e) {
          console.error("Lỗi khi tìm người thân:", e);
        }
      }

      // Format birth year
      let yob = 'Chưa cập nhật';
      if (finalDob !== 'Chưa cập nhật') {
        yob = finalDob.substring(0, 4); // YYYY-MM-DD
        if (!yob.startsWith('19') && !yob.startsWith('20')) {
          const parts = finalDob.split('-');
          if (parts.length === 3) yob = parts[0]; // Format is sometimes YYYY-MM-DD
        }
      }

      return {
        id: appointment.id,
        name: displayPatientName,
        yob: yob,
        gender: finalGender,
        dob: finalDob,
        age: finalDob !== 'Chưa cập nhật' && yob !== 'Chưa cập nhật' ? new Date().getFullYear() - parseInt(yob) : 0,
        code: appointment.appointmentCode || `LH${appointment.bookingDate.replace(/\//g, '').substring(0, 6)}-${String(appointment.id).padStart(5, '0')}`,
        patientCode: finalPatientCode,
        time: appointment.bookingTime,
        doctor: `BS. ${appointment.doctor.fullName}`,
        doctorId: appointment.doctorId,
        specialty: appointment.specialty,
        room: appointment.room || 'Phòng 201 - Tầng 2', // Default fallback
        checkinTime: appointment.updatedAt ? new Date(appointment.updatedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        status: appointment.status === 'ĐÃ XÁC NHẬN' ? 'Đã check-in' : 'Đã cấp số',
        phone: displayPhone,
        address: appointment.patient.address || 'Chưa cập nhật',
        queueNumber: (appointment as any).queueNumber || null // Type workaround for newly added field
      };
    }));

    return { success: true, data: result };
  } catch (error) {
    console.error('Lỗi khi lấy danh sách check-in:', error);
    return { success: false, data: [] };
  }
}

// 2. Issue a queue number for a checked-in patient
export async function issueQueueNumber(appointmentId: number, dateStr: string) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.findUnique({
        where: { id: appointmentId }
      });
      
      if (!appointment) throw new Error('Không tìm thấy lịch hẹn');
      if (appointment.status === 'ĐÃ CẤP SỐ') throw new Error('Lịch hẹn đã được cấp số');

      const todayAppointments = await tx.appointment.findMany({
        where: {
          doctorId: appointment.doctorId,
          bookingDate: dateStr,
          queueNumber: { not: null }
        },
        select: { queueNumber: true }
      });

      let nextNumber = 1;
      if (todayAppointments.length > 0) {
        const numbers = todayAppointments
          .map((a: any) => parseInt(a.queueNumber?.replace('A', '') || '0'))
          .filter((n: number) => !isNaN(n));
        
        if (numbers.length > 0) {
          nextNumber = Math.max(...numbers) + 1;
        }
      }

      const newQueueString = `A${String(nextNumber).padStart(3, '0')}`;

      const updated = await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          status: 'ĐÃ CẤP SỐ',
          queueNumber: newQueueString
        }
      });

      return { success: true, queueNumber: newQueueString };
    });

    return result;
  } catch (error: any) {
    console.error('Lỗi khi cấp số:', error);
    return { success: false, message: error.message || 'Không thể cấp số lúc này.' };
  }
}

// 3. Get Queue Stats for Sidebar
export async function getRoomQueueStats(dateStr: string, doctorId?: number) {
  try {
    const whereClause: any = {
      bookingDate: dateStr,
      queueNumber: { not: null }
    };
    
    if (doctorId) {
      whereClause.doctorId = doctorId;
    }

    const queueList = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: true,
        doctor: true
      },
      orderBy: { queueNumber: 'asc' }
    });

    const formattedQueue = queueList.map((a: any) => {
      let qStatus = 'Chưa gọi';
      if (a.status === 'HOÀN THÀNH') qStatus = 'Đã khám';
      else if (a.status === 'ĐANG KHÁM') qStatus = 'Đang khám';
      else if (a.status === 'ĐÃ CẤP SỐ') qStatus = 'Đang chờ';
      
      return {
        queueNumber: a.queueNumber,
        patientName: a.patient.fullName,
        doctorName: `BS. ${a.doctor.fullName}`,
        time: a.bookingTime,
        status: qStatus,
        room: a.room || 'Phòng khám',
        rawStatus: a.status
      };
    });

    return { success: true, queueList: formattedQueue };
  } catch (error) {
    console.error('Lỗi khi lấy stats hàng đợi:', error);
    return { success: false, queueList: [] };
  }
}
