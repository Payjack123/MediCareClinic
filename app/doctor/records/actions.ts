'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getDoctorMedicalRecords() {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    const doctorId = parseInt(userIdStr);

    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
      include: { doctorProfile: true }
    });

    if (!doctor) return { success: false, message: 'Không tìm thấy thông tin bác sĩ' };

    const records = await prisma.examination.findMany({
      where: { doctorId },
      include: {
        patient: {
          include: {
            patientProfile: true
          }
        },
        appointment: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedRecords = records.map(record => ({
      id: record.id,
      code: `BA${record.id.toString().padStart(5, '0')}`,
      patientId: record.patientId,
      patientName: record.patient.fullName,
      patientCode: record.patient.patientProfile?.patientCode || `BN${record.patientId.toString().padStart(4, '0')}`,
      date: new Date(record.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: new Date(record.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      diagnosis: record.diagnosis || 'Chưa cập nhật',
      status: record.appointment?.status === 'HOÀN THÀNH' ? 'Hoàn thành' : 'Đang theo dõi',
      doctorName: doctor.fullName,
    }));

    return { 
      success: true, 
      data: {
        records: formattedRecords,
        doctor: {
          name: doctor.fullName,
          avatar: doctor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.fullName)}&background=E0E7FF&color=2563EB`
        }
      } 
    };
  } catch (error) {
    console.error('Lỗi lấy danh sách hồ sơ bệnh án:', error);
    return { success: false, message: 'Lỗi server' };
  }
}
