'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getInvoices(filters?: { search?: string, fromDate?: string, toDate?: string, status?: string }) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    const whereClause: any = {};

    if (filters?.search) {
      whereClause.OR = [
        { invoiceCode: { contains: filters.search } },
        { patient: { fullName: { contains: filters.search } } },
        { patient: { phone: { contains: filters.search } } },
        { patient: { patientProfile: { patientCode: { contains: filters.search } } } }
      ];
    }

    if (filters?.fromDate || filters?.toDate) {
      whereClause.createdAt = {};
      if (filters.fromDate) {
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

    if (filters?.status) {
      whereClause.status = filters.status;
    }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: {
        patient: { include: { patientProfile: true } },
        doctor: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, data: invoices };
  } catch (error) {
    console.error("Lỗi lấy danh sách hóa đơn:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function getInvoiceDetail(id: number) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { 
        patient: { include: { patientProfile: true } },
        doctor: { include: { doctorProfile: true } },
        appointment: true,
        items: true
      }
    });

    if (!invoice) return { success: false, message: 'Không tìm thấy hóa đơn' };

    return { success: true, data: invoice };
  } catch (error) {
    console.error("Lỗi lấy chi tiết hóa đơn:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function updateInvoiceStatus(id: number, status: string) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    await prisma.invoice.update({
      where: { id },
      data: { status }
    });

    return { success: true, message: `Chuyển trạng thái hóa đơn thành ${status}` };
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái hóa đơn:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}
