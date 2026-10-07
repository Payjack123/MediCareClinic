// app/actions/doctor.ts
'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// 1. LẤY DỮ LIỆU DASHBOARD
export async function getDoctorDashboardData() {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    const doctorId = parseInt(userIdStr);

    // Lấy ngày hôm nay (VD: 23/07/2026)
    const todayStr = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    // Lấy thông tin bác sĩ
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
      include: { doctorProfile: true }
    });

    // Thống kê KPIs song song để tối ưu tốc độ
    const [todayAppts, totalPatients, prescriptions, pendingLabs] = await Promise.all([
      prisma.appointment.findMany({
        where: { doctorId, bookingDate: todayStr },
        include: { patient: { select: { id: true, fullName: true, patientProfile: true, gender: true, dob: true } } },
        orderBy: { bookingTime: 'asc' }
      }),
      prisma.appointment.groupBy({
        by: ['patientId'],
        where: { doctorId }
      }),
      prisma.prescription.count({ 
        where: { patient: { appointmentsAsPatient: { some: { doctorId } } } } 
      }),
      prisma.labTest.count({ 
        where: { doctorName: doctor?.fullName, statusType: 'PENDING' } 
      })
    ]);

    return {
      success: true,
      data: {
        doctor,
        stats: {
          todayCount: todayAppts.length,
          totalPatients: totalPatients.length,
          prescriptionsCount: prescriptions,
          pendingLabsCount: pendingLabs
        },
        appointments: todayAppts
      }
    };
  } catch (error) {
    console.error('Lỗi lấy dữ liệu bác sĩ:', error);
    return { success: false, message: 'Lỗi server' };
  }
}

// 2. LƯU KẾT QUẢ KHÁM BỆNH
export async function saveExamination(data: { appointmentId: number, patientId: number, symptoms: string, diagnosis: string, notes: string }) {
  try {
    const cookieStore = await cookies();
    const doctorId = parseInt(cookieStore.get('user_id')?.value || '0');

    await prisma.$transaction([
      prisma.examination.create({
        data: {
          appointmentId: data.appointmentId,
          patientId: data.patientId,
          doctorId: doctorId,
          symptoms: data.symptoms,
          diagnosis: data.diagnosis,
          notes: data.notes
        }
      }),
      prisma.appointment.update({
        where: { id: data.appointmentId },
        data: { status: 'HOÀN THÀNH' }
      })
    ]);

    return { success: true, message: 'Đã lưu bệnh án thành công!' };
  } catch (error) {
    return { success: false, message: 'Lỗi khi lưu bệnh án.' };
  }
}

// 3. LƯU ĐƠN THUỐC
export async function savePrescription(patientId: number, items: any[]) {
  try {
    const code = `DT${Math.floor(Math.random() * 10000)}`;
    await prisma.prescription.create({
      data: {
        patientId,
        code,
        items: {
          create: items.map(item => ({
            medicationName: item.name,
            dosage: item.dosage,
            instructions: item.time,
            remaining: item.qty,
            statusText: 'Đang dùng',
            iconType: 'pill'
          }))
        }
      }
    });
    return { success: true, message: 'Đã lưu đơn thuốc!' };
  } catch (error) {
    return { success: false, message: 'Lỗi khi lưu đơn thuốc.' };
  }
}

// 4. GỬI YÊU CẦU XÉT NGHIỆM
export async function saveLabRequests(patientId: number, tests: string[], notes: string) {
  try {
    const cookieStore = await cookies();
    const doctorId = parseInt(cookieStore.get('user_id')?.value || '0');
    
    const doctor = await prisma.user.findUnique({ where: { id: doctorId } });

    await Promise.all(tests.map(testName => 
      prisma.labTest.create({
        data: {
          patientId,
          testName,
          date: new Date(),
          doctorName: doctor?.fullName || 'Bác sĩ',
          result: 'Đang chờ kết quả',
          statusType: 'PENDING',
          notes: notes
        }
      })
    ));

    return { success: true, message: 'Đã gửi yêu cầu xét nghiệm!' };
  } catch (error) {
    return { success: false, message: 'Lỗi khi gửi yêu cầu.' };
  }
}