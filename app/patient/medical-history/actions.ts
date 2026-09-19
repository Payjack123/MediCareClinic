'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getMedicalHistoryData() {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    
    const authUser = { id: parseInt(userIdStr) };

    // Lấy thông tin user (patient)
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        fullName: true,
        patientProfile: true
      }
    });

    if (!user) return { success: false, message: 'Không tìm thấy người dùng' };

    // Lấy danh sách lịch khám đã hoàn thành hoặc đã hủy
    const historyAppointments = await prisma.appointment.findMany({
      where: {
        patientId: user.id,
        status: {
          in: ['HOÀN THÀNH', 'ĐÃ HỦY']
        }
      },
      include: {
        doctor: {
          include: {
            doctorProfile: true
          }
        },
        examination: true // Lấy thêm thông tin Examination nếu có
      },
      orderBy: {
        bookingDate: 'desc'
      }
    });

    const appointments = historyAppointments.map((apt: any) => {
      const parts = apt.bookingDate.split('/');
      let day = '', month = '', year = '';
      if (parts.length === 3) {
        day = parts[0];
        month = parts[1];
        year = parts[2];
      }

      let uiStatus = apt.status === 'HOÀN THÀNH' ? 'Đã hoàn thành' : 'Đã hủy';
      let statusColor = apt.status === 'HOÀN THÀNH' ? 'text-blue-700 bg-blue-100' : 'text-red-700 bg-red-100';

      let parsedNote = apt.reason || '';
      let patientDetails = null;

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
        day,
        month,
        year,
        time: apt.bookingTime,
        rawDate: apt.bookingDate,
        specialty: apt.specialty,
        doctor: apt.doctor.fullName,
        clinic: 'Phòng khám 201 - Tầng 2', // mock for UI
        status: uiStatus,
        statusColor,
        reason: parsedNote || 'Khám sức khỏe định kỳ',
        patientDetails,
        diagnosis: apt.examination?.diagnosis || (uiStatus === 'Đã hủy' ? '' : 'Chưa có chẩn đoán'),
        notes: apt.examination?.notes || '',
        price: apt.doctor.doctorProfile?.price || 200000,
        avatar: apt.doctor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctor.fullName)}&background=2563EB&color=fff`,
        doctorId: apt.doctorId
      };
    });

    // Sort by date (newest first)
    appointments.sort((a, b) => {
      const da = a.rawDate.split('/').reverse().join('');
      const db = b.rawDate.split('/').reverse().join('');
      if (da !== db) return db.localeCompare(da);
      return b.time.localeCompare(a.time);
    });

    // Thống kê
    const completedCount = historyAppointments.filter((a: any) => a.status === 'HOÀN THÀNH').length;
    
    // Ngày khám gần nhất
    let latestVisit = null;
    const completedAppts = historyAppointments.filter((a: any) => a.status === 'HOÀN THÀNH');
    if (completedAppts.length > 0) {
      // Vì đã orderBy bookingDate desc nhưng nó là string dd/MM/yyyy nên có thể không chuẩn 100%
      // Lấy phần tử đầu tiên sau khi sort thủ công
      const sorted = completedAppts.sort((a: any, b: any) => {
        const da = a.bookingDate.split('/').reverse().join('');
        const db = b.bookingDate.split('/').reverse().join('');
        return db.localeCompare(da);
      });
      latestVisit = sorted[0].bookingDate;
    }

    // Tính số bác sĩ, số chuyên khoa
    const uniqueDoctors = new Set(historyAppointments.filter((a: any) => a.status === 'HOÀN THÀNH').map((a: any) => a.doctorId));
    const uniqueSpecialties = new Set(historyAppointments.filter((a: any) => a.status === 'HOÀN THÀNH').map((a: any) => a.specialty));

    return {
      success: true,
      data: {
        user,
        appointments,
        stats: {
          totalVisits: completedCount,
          latestVisit: latestVisit || 'Chưa có',
          doctorsCount: uniqueDoctors.size,
          specialtiesCount: uniqueSpecialties.size
        }
      }
    };

  } catch (error: any) {
    console.error("Lỗi lấy lịch sử khám:", error);
    return { success: false, message: error.message };
  }
}

export async function getMedicalHistoryById(id: number) {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    
    const apt = await prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: { include: { doctorProfile: true } },
        examination: true,
        patient: { include: { patientProfile: true } }
      }
    });

    if (!apt) return { success: false, message: 'Không tìm thấy lịch khám' };
    if (apt.patientId !== parseInt(userIdStr)) return { success: false, message: 'Không có quyền truy cập' };

    const parts = apt.bookingDate.split('/');
    let day = '', month = '', year = '';
    if (parts.length === 3) {
      day = parts[0];
      month = parts[1];
      year = parts[2];
    }

    let uiStatus = apt.status === 'HOÀN THÀNH' ? 'Đã hoàn thành' : 'Đã hủy';
    let statusColor = apt.status === 'HOÀN THÀNH' ? 'text-blue-700 bg-blue-100' : 'text-red-700 bg-red-100';

    let parsedNote = apt.reason || '';
    let patientDetails = null;

    if (parsedNote.startsWith('Người khám: ')) {
      const partsArr = parsedNote.split('. Lý do: ');
      const patientPart = partsArr[0]; 
      parsedNote = partsArr[1] || '';

      const subParts = patientPart.split(' - ');
      patientDetails = {
        name: subParts.find((p: string) => p.startsWith('Người khám: '))?.replace('Người khám: ', '') || '',
        cccd: subParts.find((p: string) => p.startsWith('CCCD: '))?.replace('CCCD: ', '') || '',
        phone: subParts.find((p: string) => p.startsWith('SĐT: '))?.replace('SĐT: ', '') || '',
        address: subParts.find((p: string) => p.startsWith('ĐC: '))?.replace('ĐC: ', '') || ''
      };
    }

    if (!patientDetails && apt.patient) {
      patientDetails = {
        name: (apt as any).patient.fullName || '',
        cccd: (apt as any).patient.patientProfile?.cccd || '',
        phone: (apt as any).patient.phone || '',
        address: (apt as any).patient.address || ''
      };
    }

    const data = {
      id: apt.id,
      day, month, year,
      time: apt.bookingTime,
      rawDate: apt.bookingDate,
      specialty: apt.specialty,
      doctor: apt.doctor.fullName,
      clinic: 'Phòng khám 201 - Tầng 2',
      status: uiStatus,
      statusColor,
      reason: parsedNote || 'Khám sức khỏe định kỳ',
      patientDetails,
      diagnosis: apt.examination?.diagnosis || (uiStatus === 'Đã hủy' ? '' : 'Chưa có chẩn đoán'),
      notes: apt.examination?.notes || '',
      price: apt.doctor.doctorProfile?.price || 200000,
      avatar: apt.doctor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctor.fullName)}&background=2563EB&color=fff`,
    };

    return { success: true, data };
  } catch (error: any) {
    console.error("Lỗi lấy chi tiết lịch sử khám:", error);
    return { success: false, message: error.message };
  }
}

