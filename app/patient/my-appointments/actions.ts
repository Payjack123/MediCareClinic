'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// 1. Lấy dữ liệu cho trang Lịch hẹn của tôi
export async function getMyAppointmentsData() {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    
    const userId = parseInt(userIdStr);

    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      select: { id: true, fullName: true, phone: true, address: true, patientProfile: true } 
    });

    if (!user) return { success: false, message: 'Không tìm thấy người dùng' };

    const appointments = await prisma.appointment.findMany({
      where: { 
        patientId: userId
      },
      orderBy: [
        { bookingDate: 'desc' },
        { bookingTime: 'desc' }
      ],
      include: {
        doctor: {
          select: {
            fullName: true,
            avatar: true,
            doctorProfile: true
          }
        }
      }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const validAppointments = appointments.filter(apt => {
      const parts = apt.bookingDate.split('/');
      if (parts.length === 3) {
        const aptDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        if (apt.status === 'ĐÃ HỦY' && aptDate < today) {
          return false;
        }
      }
      return true;
    });

    // Ánh xạ trạng thái và format data
    const formattedAppointments = validAppointments.map(apt => {
      // Giả sử bookingDate format: "15/08/2026"
      const [day, month, year] = apt.bookingDate.split('/');
      let dayOfWeek = 'Chưa rõ';
      if (day && month && year) {
        const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        dayOfWeek = days[dateObj.getDay()];
      }

      // Map DB Status to UI Status
      let uiStatus = 'Sắp tới';
      let statusColor = 'text-gray-700 bg-gray-100';

      if (apt.status === 'CHỜ XÁC NHẬN') {
        uiStatus = 'Sắp tới';
        statusColor = 'text-yellow-700 bg-yellow-100';
      } else if (apt.status === 'ĐÃ XÁC NHẬN') {
        uiStatus = 'Đã Check-in';
        statusColor = 'text-emerald-700 bg-emerald-100';
      } else if (apt.status === 'ĐÃ CẤP SỐ') {
        uiStatus = `Chờ khám (Số ${apt.queueNumber})`;
        statusColor = 'text-indigo-700 bg-indigo-100';
      } else if (apt.status === 'ĐANG KHÁM') {
        uiStatus = 'Đang khám';
        statusColor = 'text-purple-700 bg-purple-100';
      } else if (apt.status === 'HOÀN THÀNH') {
        uiStatus = 'Đã khám xong';
        statusColor = 'text-blue-700 bg-blue-100';
      } else if (apt.status === 'ĐÃ HỦY') {
        uiStatus = 'Đã hủy';
        statusColor = 'text-red-700 bg-red-100';
      }

      let parsedNote = apt.reason || '';
      let patientDetails = null;

      if (parsedNote.startsWith('Người khám: ')) {
        const parts = parsedNote.split('. Lý do: ');
        const patientPart = parts[0]; 
        parsedNote = parts[1] || '';

        const subParts = patientPart.split(' - ');
        patientDetails = {
          name: subParts.find(p => p.startsWith('Người khám: '))?.replace('Người khám: ', '') || '',
          patientCode: subParts.find(p => p.startsWith('Mã BN: '))?.replace('Mã BN: ', '') || '',
          cccd: subParts.find(p => p.startsWith('CCCD: '))?.replace('CCCD: ', '') || '',
          phone: subParts.find(p => p.startsWith('SĐT: '))?.replace('SĐT: ', '') || '',
          address: subParts.find(p => p.startsWith('ĐC: '))?.replace('ĐC: ', '') || '',
        };
      }

      return {
        id: apt.id,
        appointmentCode: apt.appointmentCode || 'Chưa có mã',
        day: day || '00',
        monthYear: `Tháng ${month}, ${year}`,
        dayOfWeek: dayOfWeek,
        time: apt.bookingTime,
        specialty: apt.specialty,
        doctor: apt.doctor.fullName,
        doctorTitle: apt.doctor.doctorProfile?.degree ? `${apt.doctor.doctorProfile.degree} - ${apt.specialty}` : `Bác sĩ - ${apt.specialty}`,
        room: 'Phòng khám - Tầng 1', // Placeholder as not in DB
        clinic: 'Phòng Khám Đa Khoa N1',
        status: uiStatus,
        statusColor: statusColor,
        type: 'Khám tại phòng khám',
        note: parsedNote,
        patientDetails: patientDetails,
        rawDate: apt.bookingDate,
        avatar: apt.doctor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctor.fullName)}&background=2563EB&color=fff`,
        price: apt.doctor.doctorProfile?.price || 150000
      };
    });

    // Sắp xếp lại lịch hẹn từ mới nhất đến cũ nhất
    formattedAppointments.sort((a, b) => {
      const parseDate = (raw: string) => {
        if (!raw) return '';
        if (raw.includes('/')) {
          const parts = raw.split('/');
          if (parts.length === 3) {
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          }
        }
        return raw;
      };

      const dateA = parseDate(a.rawDate);
      const dateB = parseDate(b.rawDate);

      const timeA = a.time ? a.time.split('-')[0].trim() : '';
      const timeB = b.time ? b.time.split('-')[0].trim() : '';

      const dtA = `${dateA}T${timeA}`;
      const dtB = `${dateB}T${timeB}`;

      if (dtA > dtB) return -1;
      if (dtA < dtB) return 1;
      return 0;
    });

    return { success: true, data: { user, appointments: formattedAppointments } };
  } catch (error) {
    console.error('Lỗi lấy dữ liệu my-appointments:', error);
    return { success: false, message: 'Lỗi server' };
  }
}

// 2. Hủy lịch hẹn
export async function cancelAppointment(id: number) {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    
    const userId = parseInt(userIdStr);

    const apt = await prisma.appointment.findUnique({ where: { id } });
    if (!apt || apt.patientId !== userId) {
      return { success: false, message: 'Không tìm thấy lịch hẹn hoặc không có quyền.' };
    }

    if (apt.status === 'ĐÃ HỦY' || apt.status === 'HOÀN THÀNH') {
      return { success: false, message: 'Không thể hủy lịch này.' };
    }

    await prisma.appointment.update({
      where: { id },
      data: { status: 'ĐÃ HỦY' }
    });

    revalidatePath('/patient/my-appointments');
    return { success: true, message: 'Hủy lịch thành công' };
  } catch (error) {
    console.error('Lỗi hủy lịch:', error);
    return { success: false, message: 'Lỗi khi hủy lịch' };
  }
}
