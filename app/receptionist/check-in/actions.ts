'use server';

import prisma from '@/lib/prisma';

export async function searchAppointment(query: string, searchType?: string) {
  try {
    const todayDate = new Date();
    const todayStr = `${String(todayDate.getDate()).padStart(2, '0')}/${String(todayDate.getMonth() + 1).padStart(2, '0')}/${todayDate.getFullYear()}`;

    const cleanQuery = query.trim();
    let whereClause: any = {};

    // Auto-detect query type if searchType is not explicitly provided
    if (cleanQuery.startsWith('LH')) {
      whereClause = { appointmentCode: cleanQuery };
    } else if (cleanQuery.startsWith('BN')) {
      whereClause = {
        status: 'CHỜ XÁC NHẬN',
        patient: { patientProfile: { patientCode: cleanQuery } }
      };
    } else if (/^\d{10,11}$/.test(cleanQuery)) {
      whereClause = {
        status: 'CHỜ XÁC NHẬN',
        patient: { phone: cleanQuery }
      };
    } else if (/^\d{12}$/.test(cleanQuery)) {
      whereClause = {
        status: 'CHỜ XÁC NHẬN',
        patient: { patientProfile: { cccd: cleanQuery } }
      };
    } else {
      // Fallback: try appointment code
      whereClause = { appointmentCode: cleanQuery };
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: { include: { patientProfile: true } },
        doctor: true,
      }
    });

    if (!appointments || appointments.length === 0) {
      return { success: false, error: 'Không tìm thấy lịch hẹn phù hợp.' };
    }

    // Sắp xếp ngày hẹn từ mới nhất đến cũ nhất (giảm dần)
    appointments.sort((a, b) => {
      const parseDate = (dString: string) => {
        if (!dString) return 0;
        const parts = dString.split('/');
        if (parts.length === 3) {
          return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
        }
        return 0;
      };
      return parseDate(b.bookingDate) - parseDate(a.bookingDate);
    });

    // Format the response for the frontend (Map to array)
    const result = appointments.map(appointment => {
      let displayPatientName = appointment.patient.fullName;
      let displayPhone = appointment.patient.phone || 'Chưa cập nhật';
      let displayCccd = appointment.patient.patientProfile?.cccd || 'Chưa cập nhật';
      let isForRelative = false;

      // Extract real patient info if booked for someone else
      if (appointment.reason && appointment.reason.startsWith('Người khám:')) {
        isForRelative = true;
        const nameMatch = appointment.reason.match(/Người khám: (.*?) - CCCD:/);
        if (nameMatch) displayPatientName = nameMatch[1].trim();

        const cccdMatch = appointment.reason.match(/- CCCD: (.*?) - SĐT:/);
        if (cccdMatch) {
          const extractedCccd = cccdMatch[1].trim();
          displayCccd = extractedCccd === 'Không có' ? 'Chưa cập nhật' : extractedCccd;
        }

        const phoneMatch = appointment.reason.match(/- SĐT: (.*?) - ĐC:/);
        if (phoneMatch) displayPhone = phoneMatch[1].trim();
      }

      return {
        id: appointment.id,
        patientName: displayPatientName,
        patientCode: isForRelative ? 'Chưa cập nhật' : (appointment.patient.patientProfile?.patientCode || 'Chưa cập nhật'),
        dob: isForRelative ? 'Chưa cập nhật' : (appointment.patient.dob || 'Chưa cập nhật'),
        gender: isForRelative ? 'Chưa cập nhật' : (appointment.patient.gender || 'Chưa cập nhật'),
        phone: displayPhone,
        cccd: displayCccd,
        bhyt: isForRelative ? 'Chưa cập nhật' : (appointment.patient.patientProfile?.bhyt || 'Chưa cập nhật'),
        appointmentCode: appointment.appointmentCode || `LH${appointment.bookingDate.replace(/\//g, '').substring(0, 6)}-${String(appointment.id).padStart(5, '0')}`,
        bookingDate: appointment.bookingDate,
        bookingTime: appointment.bookingTime,
        status: appointment.status, // CHỜ XÁC NHẬN, ĐÃ XÁC NHẬN, etc.
        paymentMethod: appointment.paymentMethod,
        paymentStatus: appointment.paymentStatus,
        doctorName: `BS. ${appointment.doctor.fullName}`,
        specialty: appointment.specialty,
        room: appointment.room || 'Chưa xếp phòng',
        createdAt: appointment.createdAt.toLocaleString('vi-VN'),
      };
    });

    return { success: true, data: result };

  } catch (error) {
    console.error("Error searching appointment:", error);
    return { success: false, error: "Lỗi hệ thống khi tìm kiếm." };
  }
}

export async function confirmCheckIn(appointmentId: number) {
  try {
    const app = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!app) return { success: false, error: "Lịch hẹn không tồn tại." };
    if (app.status !== 'CHỜ XÁC NHẬN') return { success: false, error: "Lịch hẹn đã được xử lý." };
    if (app.paymentMethod === 'TẠI QUẦY' && app.paymentStatus !== 'ĐÃ THANH TOÁN') {
      return { success: false, error: "Bệnh nhân chưa thanh toán. Vui lòng thu tiền trước khi Check-in." };
    }

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'ĐÃ XÁC NHẬN' }
    });

    return { success: true };
  } catch (error) {
    console.error("Error confirming check-in:", error);
    return { success: false, error: "Lỗi hệ thống khi check-in." };
  }
}

export async function confirmPayment(appointmentId: number) {
  try {
    const app = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!app) return { success: false, error: "Lịch hẹn không tồn tại." };

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { paymentStatus: 'ĐÃ THANH TOÁN' }
    });

    return { success: true };
  } catch (error) {
    console.error("Error confirming payment:", error);
    return { success: false, error: "Lỗi hệ thống khi thu tiền." };
  }
}

export async function cancelNoShow(appointmentId: number) {
  try {
    const app = await prisma.appointment.findUnique({ 
      where: { id: appointmentId },
      include: { patient: { include: { patientProfile: true } } }
    });
    if (!app) return { success: false, error: "Lịch hẹn không tồn tại." };

    await prisma.$transaction(async (tx: any) => {
      // 1. Đổi trạng thái lịch hẹn
      await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: 'ĐÃ HỦY' }
      });

      // 2. Tăng điểm noShowCount
      if (app.patient.patientProfile) {
        await tx.patientProfile.update({
          where: { userId: app.patientId },
          data: { noShowCount: { increment: 1 } }
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error cancelling no-show:", error);
    return { success: false, error: "Lỗi hệ thống khi hủy bùng kèo." };
  }
}

export async function getQueueAndHistory() {
  try {
    const todayDate = new Date();
    const todayStr = `${String(todayDate.getDate()).padStart(2, '0')}/${String(todayDate.getMonth() + 1).padStart(2, '0')}/${todayDate.getFullYear()}`;

    const todayAppointments = await prisma.appointment.findMany({
      where: {
        bookingDate: todayStr,
      },
      include: {
        patient: { select: { fullName: true } }
      },
      orderBy: { bookingTime: 'asc' }
    });

    const queue = todayAppointments
      .filter(a => a.status === 'ĐÃ XÁC NHẬN' || a.status === 'ĐANG KHÁM')
      .map(a => ({
        id: a.id,
        patientName: a.patient.fullName,
        time: a.bookingTime,
        status: a.status, // ĐÃ XÁC NHẬN -> Đang chờ, ĐANG KHÁM -> Đang khám
        code: `A${String(a.id).padStart(3, '0')}` // Mock sequence number
      }));

    const history = todayAppointments
      .filter(a => a.status === 'ĐÃ XÁC NHẬN' || a.status === 'ĐANG KHÁM' || a.status === 'HOÀN THÀNH')
      .sort((a, b) => b.id - a.id)
      .slice(0, 10)
      .map(a => ({
        id: a.id,
        patientName: a.patient.fullName,
        date: a.bookingDate,
        time: a.bookingTime,
        status: 'Đã vào khám',
        code: `A${String(a.id).padStart(3, '0')}`
      }));

    return { success: true, data: { queue, history } };
  } catch (error) {
    console.error("Error fetching queue:", error);
    return { success: false, error: "Lỗi hệ thống khi tải hàng đợi." };
  }
}
