'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getLabTests(filters?: { search?: string, fromDate?: string, toDate?: string, status?: string }) {
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
        { testName: { contains: filters.search } }
      ];
    }

    if (filters?.fromDate || filters?.toDate) {
      whereClause.date = {};
      if (filters.fromDate) {
        const parts = filters.fromDate.split('/');
        if (parts.length === 3) {
          const from = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00Z`);
          whereClause.date.gte = from;
        }
      }
      if (filters.toDate) {
        const parts = filters.toDate.split('/');
        if (parts.length === 3) {
          const to = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T23:59:59Z`);
          whereClause.date.lte = to;
        }
      }
    }

    if (filters?.status) {
      whereClause.statusType = filters.status;
    }

    const labTests = await prisma.labTest.findMany({
      where: whereClause,
      include: {
        patient: { include: { patientProfile: true } }
      },
      orderBy: { date: 'desc' }
    });

    return { success: true, data: labTests };
  } catch (error) {
    console.error("Lỗi lấy danh sách xét nghiệm:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function getLabTestDetail(id: number) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    const labTest = await prisma.labTest.findUnique({
      where: { id },
      include: { 
        patient: { include: { patientProfile: true } }
      }
    });

    if (!labTest) return { success: false, message: 'Không tìm thấy phiếu xét nghiệm' };

    return { success: true, data: labTest };
  } catch (error) {
    console.error("Lỗi lấy chi tiết xét nghiệm:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function updateLabTestStatus(id: number, status: string) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    await prisma.labTest.update({
      where: { id },
      data: { statusType: status }
    });

    return { success: true, message: `Chuyển trạng thái phiếu xét nghiệm thành ${status}` };
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái xét nghiệm:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}
