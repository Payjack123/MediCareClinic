'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getDoctorAppointmentsData(selectedDate?: string) {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    const doctorId = parseInt(userIdStr);

    // 1. Xác định ngày cần lấy dữ liệu (Mặc định là hôm nay)
    const today = new Date();
    const dateStr = selectedDate || 
      `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    // 2. Lấy thông tin Bác sĩ
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
      include: { doctorProfile: { include: { specialty: true } } }
    });

    if (!doctor) return { success: false, message: 'Không tìm thấy bác sĩ' };

    // 3. Lấy danh sách lịch khám của Bác sĩ vào NGÀY ĐÃ CHỌN
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctorId,
        bookingDate: dateStr
      },
      include: {
        patient: { include: { patientProfile: true } }
      },
      orderBy: {
        bookingTime: 'asc' // Sắp xếp giờ từ sáng đến chiều
      }
    });

    // 4. Tính toán thống kê
    let completed = 0;
    let waiting = 0;
    let canceled = 0;
    let examining = 0;
    let checkedIn = 0;

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
      else if (uiStatus === 'Đang khám') examining++;
      else if (uiStatus === 'Đã check-in') checkedIn++;
      else waiting++; 

      let dob = apt.patient.dob || 'N/A';

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

      return {
        id: apt.id,
        patientId: apt.patient.id,
        patientName: patientDetails?.name || apt.patient.fullName,
        patientCode: apt.patient.patientProfile?.patientCode || `BN-${apt.patient.id}`,
        gender: apt.patient.gender || 'Nam',
        dob: dob,
        time: apt.bookingTime?.split(' - ')[0] || apt.bookingTime, 
        status: uiStatus,
        rawStatus: uiStatus,
        reason: parsedNote || 'Khám bệnh',
        patientDetails,
        patientPhone: patientDetails?.phone || apt.patient.phone,
        room: apt.specialty || doctor.doctorProfile?.specialty?.name || 'Phòng khám',
        avatar: apt.patient.avatar || `https://ui-avatars.com/api/?name=${apt.patient.fullName.replace(/ /g, '+')}&background=random`
      };
    });

    return {
      success: true,
      data: {
        doctorInfo: {
          name: doctor.fullName,
          rating: doctor.doctorProfile?.rating || 5.0,
          avatar: doctor.avatar || `https://ui-avatars.com/api/?name=${doctor.fullName.replace(/ /g, '+')}&background=172554&color=fff`
        },
        stats: {
          total: appointments.length,
          completed,
          waiting,
          canceled,
          examining,
          checkedIn
        },
        appointments: formattedAppointments,
        currentDate: dateStr
      }
    };
  } catch (error) {
    console.error('Lỗi lấy dữ liệu lịch khám:', error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}