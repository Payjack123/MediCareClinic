'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getInvoices(searchQuery: string, statusFilter: string) {
  try {
    let whereClause: any = {};

    if (statusFilter && statusFilter !== 'ALL') {
      whereClause.status = statusFilter;
    }

    if (searchQuery) {
      whereClause.OR = [
        { invoiceCode: { contains: searchQuery } },
        { patient: { fullName: { contains: searchQuery } } },
        { patient: { phone: { contains: searchQuery } } },
        { patient: { patientProfile: { patientCode: { contains: searchQuery } } } },
      ];
    }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: {
        patient: {
          include: {
            patientProfile: true
          }
        },
        doctor: true,
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to 50 for performance in this view
    });

    const formattedData = invoices.map(inv => ({
      id: inv.id,
      invoiceCode: inv.invoiceCode,
      patientName: inv.patient.fullName,
      patientCode: inv.patient.patientProfile?.patientCode || `BN${inv.patient.id}`,
      phone: inv.patient.phone,
      doctorName: inv.doctor?.fullName || 'N/A',
      totalAmount: inv.totalAmount,
      insuranceAmount: inv.insuranceAmount,
      finalAmount: inv.finalAmount,
      status: inv.status, // "Chờ thanh toán", "Đã thanh toán", "Hủy"
      createdAt: inv.createdAt.toISOString(),
      items: inv.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.total
      }))
    }));

    return { success: true, data: formattedData };
  } catch (error) {
    console.error('Lỗi khi lấy danh sách hóa đơn:', error);
    return { success: false, data: [], message: 'Đã xảy ra lỗi hệ thống' };
  }
}
