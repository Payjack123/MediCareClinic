'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// 1. Get all queue appointments for a specific date
export async function getQueueList(dateStr: string) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        bookingDate: dateStr,
        status: { in: ['ĐÃ CẤP SỐ', 'ĐANG KHÁM', 'HOÀN THÀNH', 'BỎ LƯỢT'] }
      },
      include: {
        patient: { include: { patientProfile: true } },
        doctor: true
      },
      orderBy: [
        { queueNumber: 'asc' } // Sorted by queue number
      ]
    });

    const result = await Promise.all(appointments.map(async (appointment: any) => {
      let displayPatientName = appointment.patient.fullName;
      let displayPhone = appointment.patient.phone || 'Chưa cập nhật';
      let displayReason = appointment.reason || 'Khám tổng quát';
      let isForRelative = false;
      let extractedPatientCode = 'Chưa cập nhật';

      // Extract relative info if booked for someone else
      if (appointment.reason && appointment.reason.startsWith('Người khám:')) {
        isForRelative = true;
        const nameMatch = appointment.reason.match(/Người khám: (.*?) - Mã BN:/);
        if (nameMatch) displayPatientName = nameMatch[1].trim();

        const codeMatch = appointment.reason.match(/- Mã BN: (.*?) - CCCD:/);
        if (codeMatch) {
          extractedPatientCode = codeMatch[1].trim();
          if (extractedPatientCode === 'Không có') extractedPatientCode = 'Chưa cập nhật';
        }
        const phoneMatch = appointment.reason.match(/- SĐT: (.*?) - ĐC:/);
        if (phoneMatch) displayPhone = phoneMatch[1].trim();
        const reasonMatch = appointment.reason.match(/\. Lý do:\s*(.*)/);
        if (reasonMatch) displayReason = reasonMatch[1].trim();
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

      let age = 0;
      if (finalDob && finalDob !== 'Chưa cập nhật') {
        const parts = finalDob.split('-');
        if (parts.length === 3) {
          age = new Date().getFullYear() - parseInt(parts[0]);
        }
      }

      // Calculate waiting time if status is 'ĐÃ CẤP SỐ'
      // Mock calculation for UI purposes based on updated time
      const checkInTime = appointment.updatedAt ? new Date(appointment.updatedAt) : new Date();
      const now = new Date();
      let waitingMinutes = Math.floor((now.getTime() - checkInTime.getTime()) / 60000);
      if (waitingMinutes < 0) waitingMinutes = 0;
      
      let mappedStatus = appointment.status;
      if (mappedStatus === 'ĐÃ CẤP SỐ') mappedStatus = 'Đang chờ';
      else if (mappedStatus === 'ĐANG KHÁM') mappedStatus = 'Đang khám';
      else if (mappedStatus === 'HOÀN THÀNH') mappedStatus = 'Đã khám';
      else if (mappedStatus === 'BỎ LƯỢT') mappedStatus = 'Bỏ lượt';

      return {
        id: appointment.id,
        queueNumber: appointment.queueNumber || 'N/A',
        name: displayPatientName,
        gender: finalGender,
        age: age,
        dob: finalDob,
        phone: displayPhone,
        appointmentCode: appointment.appointmentCode || 'N/A',
        patientCode: finalPatientCode,
        appointmentTime: appointment.bookingTime,
        checkInTime: checkInTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        waitTime: `${waitingMinutes} phút`,
        status: mappedStatus,
        doctor: `BS. ${appointment.doctor.fullName}`,
        specialty: appointment.specialty,
        room: appointment.room || 'Phòng 201',
        reason: displayReason,
        hasInsurance: true // Mock data for now
      };
    }));

    return { success: true, data: result };
  } catch (error) {
    console.error('Lỗi khi lấy danh sách hàng đợi:', error);
    return { success: false, data: [] };
  }
}

// 2. Call Patient (change status to ĐANG KHÁM)
export async function callPatient(appointmentId: number) {
  try {
    // If there is another patient currently ĐANG KHÁM in the same room/doctor, 
    // ideally we would set them to HOÀN THÀNH or something, but for now just update this one.
    
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'ĐANG KHÁM' }
    });
    revalidatePath('/receptionist/queue');
    return { success: true };
  } catch (error) {
    console.error('Lỗi khi gọi bệnh nhân:', error);
    return { success: false, message: 'Không thể gọi bệnh nhân lúc này.' };
  }
}

// 3. Call Next Patient
export async function callNextPatient(dateStr: string) {
  try {
    // Find the first patient in queue (ĐÃ CẤP SỐ) ordered by queue number
    const nextPatient = await prisma.appointment.findFirst({
      where: {
        bookingDate: dateStr,
        status: 'ĐÃ CẤP SỐ'
      },
      orderBy: { queueNumber: 'asc' }
    });

    if (!nextPatient) {
      return { success: false, message: 'Không có bệnh nhân nào đang chờ.' };
    }

    await prisma.appointment.update({
      where: { id: nextPatient.id },
      data: { status: 'ĐANG KHÁM' }
    });
    revalidatePath('/receptionist/queue');
    return { success: true, id: nextPatient.id };
  } catch (error) {
    console.error('Lỗi khi gọi bệnh nhân tiếp theo:', error);
    return { success: false, message: 'Có lỗi xảy ra.' };
  }
}

// 4. Update Status (Hoàn thành, Hủy, Bỏ lượt)
export async function updateQueueStatus(appointmentId: number, newStatus: string) {
  try {
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: newStatus }
    });
    revalidatePath('/receptionist/queue');
    return { success: true };
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error);
    return { success: false, message: 'Không thể cập nhật trạng thái.' };
  }
}

// 5. Chuyển lượt (Move to the end of the queue)
export async function transferTurn(appointmentId: number, dateStr: string) {
  try {
    // 1. Find the current highest queue number for this date
    const todayAppointments = await prisma.appointment.findMany({
      where: {
        bookingDate: dateStr,
        queueNumber: { not: null }
      } as any,
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

    // 2. Update the appointment with the new queue number and change status back to ĐÃ CẤP SỐ
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'ĐÃ CẤP SỐ',
        queueNumber: newQueueString
      } as any
    });

    revalidatePath('/receptionist/queue');
    return { success: true, newQueueNumber: newQueueString };
  } catch (error) {
    console.error('Lỗi khi chuyển lượt:', error);
    return { success: false, message: 'Không thể chuyển lượt lúc này.' };
  }
}
