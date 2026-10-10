'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getAllDoctorAppointments() {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    const doctorId = parseInt(userIdStr);

    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
      include: { doctorProfile: { include: { specialty: true } } }
    });

    if (!doctor) return { success: false, message: 'Không tìm thấy bác sĩ' };

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctorId
      },
      include: {
        patient: { include: { patientProfile: true } }
      }
      // Note: Removed string-based orderBy on bookingDate because it sorts '20/08' after '01/09' incorrectly. We will sort in JS instead.
    });

    let completed = 0;
    let upcoming = 0;
    let canceled = 0;

    const formattedAppointments = appointments.map(apt => {
      let uiStatus = apt.status || 'Đã đặt';

      // Chuyển đổi trạng thái từ Lễ tân (uppercase) sang Bác sĩ (Title case)
      if (apt.status === 'ĐÃ XÁC NHẬN' || apt.status === 'ĐÃ CẤP SỐ') {
        uiStatus = 'Đã check-in';
      } else if (apt.status === 'ĐANG KHÁM') {
        uiStatus = 'Đang khám';
      } else if (apt.status === 'HOÀN THÀNH') {
        uiStatus = 'Đã khám';
      } else if (apt.status === 'ĐÃ HỦY' || apt.status === 'BỎ LƯỢT') {
        uiStatus = 'Đã hủy';
      } else if (apt.status === 'CHỜ XÁC NHẬN') {
        uiStatus = 'Đã đặt';
      }

      if (uiStatus === 'Đã khám') completed++;
      else if (uiStatus === 'Đã hủy' || uiStatus === 'Không đến') canceled++;
      else upcoming++; // Any other status is Upcoming (Sắp tới/Chờ xác nhận)

      let parsedNote = apt.reason || '';
      let patientDetails: any = null;

      if (parsedNote.startsWith('Người khám: ')) {
        const parts = parsedNote.split('. Lý do: ');
        const patientPart = parts[0]; 
        parsedNote = parts[1] || '';

        const subParts = patientPart.split(' - ');
        patientDetails = {
          name: subParts.find((p: string) => p.startsWith('Người khám: '))?.replace('Người khám: ', '') || '',
          cccd: subParts.find((p: string) => p.startsWith('CCCD: '))?.replace('CCCD: ', '') || '',
          phone: subParts.find((p: string) => p.startsWith('SĐT: '))?.replace('SĐT: ', '') || '',
          address: subParts.find((p: string) => p.startsWith('ĐC: '))?.replace('ĐC: ', '') || ''
        };
      }

      // Parse bookingDate (dd/MM/yyyy) into weekday
      let dateWithDay = apt.bookingDate;
      if (apt.bookingDate) {
        const parts = apt.bookingDate.split('/');
        if (parts.length === 3) {
          const [d, m, y] = parts;
          const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
          if (!isNaN(dateObj.getTime())) {
            const weekday = dateObj.toLocaleDateString('vi-VN', { weekday: 'long' });
            dateWithDay = `${apt.bookingDate}\n${weekday}`;
          }
        }
      }

      return {
        id: apt.id,
        patientId: apt.patient.id,
        patientName: patientDetails?.name || apt.patient.fullName,
        patientCode: apt.patient.patientProfile?.patientCode || `BN-${apt.patient.id}`,
        gender: apt.patient.gender || 'Nam',
        time: apt.bookingTime?.split(' - ')[0] || apt.bookingTime, 
        date: apt.bookingDate,
        dateWithDay,
        status: uiStatus,
        rawStatus: uiStatus,
        reason: parsedNote || 'Khám bệnh',
        patientDetails,
        patientPhone: patientDetails?.phone || apt.patient.phone,
        room: apt.specialty || doctor.doctorProfile?.specialty?.name || 'Phòng khám',
        avatar: apt.patient.avatar || `https://ui-avatars.com/api/?name=${apt.patient.fullName.replace(/ /g, '+')}&background=random`
      };
    });

    const sortedAppointments = formattedAppointments.sort((a, b) => {
      // Parse dates from DD/MM/YYYY to Date objects
      const parseDate = (dStr: string) => {
        const parts = dStr.split('/');
        if (parts.length === 3) {
          return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
        }
        return 0;
      };

      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);

      if (dateA !== dateB) {
        return dateB - dateA; // Newest first (descending)
      }
      
      // If same date, sort by time (e.g. 15:30 > 08:00)
      if (a.time && b.time) {
        return b.time.localeCompare(a.time); // Newest time first
      }
      return 0;
    });

    return {
      success: true,
      data: {
        stats: {
          total: appointments.length,
          completed,
          upcoming,
          canceled
        },
        appointments: sortedAppointments
      }
    };
  } catch (error) {
    console.error('Lỗi lấy dữ liệu lịch khám:', error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}
