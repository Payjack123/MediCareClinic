// app/patient/dashboard/actions.ts
'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getPatientDashboardData() {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    
    if (!userIdStr) {
      return { success: false, message: 'Chưa đăng nhập' };
    }

    const userId = parseInt(userIdStr);

    // Truy vấn song song (Parallel Queries) để tối ưu tốc độ cho TiDB
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, fullName: true, patientProfile: true, email: true, phone: true } });
    if (user && (!user.patientProfile?.patientCode || user.patientProfile?.patientCode === 'BN-NEW')) {
      const generatedCode = `BN${new Date().getFullYear().toString().slice(-2)}${user.id.toString().padStart(4, '0')}`;
      await prisma.patientProfile.upsert({
        where: { userId: userId },
        update: { patientCode: generatedCode },
        create: { userId: userId, patientCode: generatedCode }
      });
    }

    const [metric, appointments, prescriptions, labTests, notifications, medicalRecords, invoices] = await Promise.all([
      prisma.healthMetric.findUnique({ where: { patientId: userId } }),
      
      prisma.appointment.findMany({ 
        where: { patientId: userId }, 
        orderBy: { createdAt: 'desc' }, 
        take: 3,
        include: { doctor: { select: { fullName: true } } } 
      }),
      
      prisma.prescription.findFirst({ 
        where: { patientId: userId }, 
        orderBy: { createdAt: 'desc' },
        include: { items: true, doctor: { select: { fullName: true } } } 
      }),

      prisma.labTest.findMany({
        where: { patientId: userId },
        orderBy: { date: 'desc' },
        take: 3
      }),

      prisma.notification.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' },
        take: 4
      }),

      prisma.examination.findFirst({
        where: { patientId: userId },
        orderBy: { createdAt: 'desc' },
        include: { doctor: { select: { fullName: true } } }
      }),

      prisma.invoice.findMany({
        where: { patientId: userId },
        orderBy: { createdAt: 'desc' },
        take: 3
      })
    ]);

    if (!user) return { success: false, message: 'Không tìm thấy người dùng' };

    return {
      success: true,
      data: {
        user,
        metric,
        appointments,
        prescription: prescriptions,
        labTests,
        notifications,
        medicalRecord: medicalRecords,
        invoices
      }
    };
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu Dashboard:', error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}