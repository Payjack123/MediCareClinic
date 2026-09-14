'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import dayjs from 'dayjs';

export async function getExaminations(filters?: { search?: string, fromDate?: string, toDate?: string, specialty?: string }) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    const whereClause: any = {};

    if (filters?.search) {
      whereClause.OR = [
        { patient: { fullName: { contains: filters.search } } },
        { patient: { phone: { contains: filters.search } } },
        { patient: { patientProfile: { patientCode: { contains: filters.search } } } },
        { appointment: { appointmentCode: { contains: filters.search } } }
      ];
    }

    // Lọc theo khoảng ngày (dựa trên createdAt của Examination hoặc bookingDate của Appointment)
    // Để đơn giản, ta lọc theo createdAt của Examination
    if (filters?.fromDate || filters?.toDate) {
      whereClause.createdAt = {};
      if (filters.fromDate) {
        // Chuyển từ DD/MM/YYYY sang YYYY-MM-DD để Prisma query
        const parts = filters.fromDate.split('/');
        if (parts.length === 3) {
          const from = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00Z`);
          whereClause.createdAt.gte = from;
        }
      }
      if (filters.toDate) {
        const parts = filters.toDate.split('/');
        if (parts.length === 3) {
          const to = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T23:59:59Z`);
          whereClause.createdAt.lte = to;
        }
      }
    }

    if (filters?.specialty) {
      whereClause.appointment = {
        specialty: filters.specialty
      };
    }

    const records = await prisma.examination.findMany({
      where: whereClause,
      include: {
        patient: { include: { patientProfile: true } },
        doctor: { include: { doctorProfile: true } },
        appointment: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, data: records };
  } catch (error) {
    console.error("Lỗi lấy danh sách hồ sơ:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function getExaminationDetail(id: number) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    const record = await prisma.examination.findUnique({
      where: { id },
      include: { 
        patient: { include: { patientProfile: true } },
        doctor: { include: { doctorProfile: true } },
        appointment: true
      }
    });

    if (!record) return { success: false, message: 'Không tìm thấy hồ sơ' };

    // Lấy thêm các thông tin liên quan (đơn thuốc, xét nghiệm trong cùng khoảng thời gian)
    // Ta lấy các đơn thuốc, xét nghiệm của patientId đó, và được tạo ra vào cùng ngày với examination này
    const examDate = dayjs(record.createdAt).format('YYYY-MM-DD');
    const startOfDay = new Date(`${examDate}T00:00:00Z`);
    const endOfDay = new Date(`${examDate}T23:59:59Z`);

    const prescriptions = await prisma.prescription.findMany({
      where: {
        patientId: record.patientId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: { items: true }
    });

    const labTests = await prisma.labTest.findMany({
      where: {
        patientId: record.patientId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    });

    // Lịch sử khám (các examination khác của bệnh nhân này, trước ngày khám này)
    const history = await prisma.examination.findMany({
      where: {
        patientId: record.patientId,
        id: { not: record.id },
        createdAt: { lt: record.createdAt }
      },
      include: {
        doctor: true,
        appointment: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    return { 
      success: true, 
      data: {
        ...record,
        prescriptions,
        labTests,
        history
      } 
    };
  } catch (error) {
    console.error("Lỗi lấy chi tiết hồ sơ:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}