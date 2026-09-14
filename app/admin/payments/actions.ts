'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getPayments(filters?: { search?: string, fromDate?: string, toDate?: string, method?: string, status?: string }) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    // Lọc Hóa đơn đã có giao dịch thu phí (paymentRef != null hoặc paymentMethod != null)
    // Để có dữ liệu demo, ta sẽ coi tất cả hóa đơn nào không phải 'Nháp' và 'Chờ phát hành' là có giao dịch thanh toán
    const whereClause: any = {
      status: { notIn: ['Nháp', 'Chờ phát hành'] }
    };

    if (filters?.search) {
      whereClause.OR = [
        { paymentRef: { contains: filters.search } },
        { invoiceCode: { contains: filters.search } },
        { patient: { fullName: { contains: filters.search } } },
        { patient: { patientProfile: { patientCode: { contains: filters.search } } } }
      ];
    }

    if (filters?.fromDate || filters?.toDate) {
      // Dùng paymentDate hoặc createdAt nếu paymentDate null (mock data fallback)
      whereClause.createdAt = {}; // Demo fallback since paymentDate might be empty
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

    if (filters?.method) {
      whereClause.paymentMethod = filters.method;
    }

    if (filters?.status) {
      whereClause.status = filters.status;
    }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: {
        patient: { include: { patientProfile: true } },
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Bọc thêm dữ liệu giả lập cho phần thu ngân (vì schema gốc ko có transaction riêng)
    const payments = invoices.map(inv => {
      // Tạo mã GD giả lập nếu ko có paymentRef
      const transCode = inv.paymentRef || `GD${inv.id.toString().padStart(5, '0')}`;
      
      // Giả lập trạng thái của transaction dựa trên status của invoice
      let transStatus = inv.status;
      if (transStatus === 'Chờ thanh toán' || transStatus === 'Chưa thanh toán') transStatus = 'Chờ xác nhận';
      else if (transStatus === 'Điều chỉnh') transStatus = 'Đang đối soát';

      return {
        id: inv.id, // dùng luôn ID của invoice để liên kết
        transactionCode: transCode,
        invoiceCode: inv.invoiceCode,
        patientName: inv.patient.fullName,
        patientCode: inv.patient.patientProfile?.patientCode,
        amount: inv.finalAmount,
        method: inv.paymentMethod || 'Tiền mặt',
        cashier: 'Lễ tân', // mock
        date: inv.paymentDate || inv.updatedAt,
        status: transStatus,
        rawInvoiceStatus: inv.status
      };
    });

    return { success: true, data: payments };
  } catch (error) {
    console.error("Lỗi lấy danh sách giao dịch:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function getPaymentDetail(id: number) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { 
        patient: { include: { patientProfile: true } },
      }
    });

    if (!invoice) return { success: false, message: 'Không tìm thấy giao dịch' };

    const transCode = invoice.paymentRef || `GD${invoice.id.toString().padStart(5, '0')}`;
    let transStatus = invoice.status;
    if (transStatus === 'Chờ thanh toán' || transStatus === 'Chưa thanh toán') transStatus = 'Chờ xác nhận';
    else if (transStatus === 'Điều chỉnh') transStatus = 'Đang đối soát';

    const transactionDetail = {
      id: invoice.id,
      transactionCode: transCode,
      invoiceCode: invoice.invoiceCode,
      patient: invoice.patient,
      expectedAmount: invoice.finalAmount, // Tiền phải thu (Hóa đơn)
      actualAmount: invoice.finalAmount,   // Tiền thực thu (Mock - luôn khớp trong demo)
      method: invoice.paymentMethod || 'Tiền mặt',
      cashier: 'Nguyễn Lan', // mock
      date: invoice.paymentDate || invoice.updatedAt,
      status: transStatus,
      rawInvoiceStatus: invoice.status
    };

    return { success: true, data: transactionDetail };
  } catch (error) {
    console.error("Lỗi lấy chi tiết giao dịch:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function updatePaymentStatus(id: number, status: string, notes?: string) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('user_role')?.value !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    // Logic: 
    // - Khi Admin xác nhận -> status Invoice = 'Đã thanh toán'
    // - Khi Admin hoàn tiền -> status Invoice = 'Hoàn tiền'
    // - Khi Admin hủy -> status Invoice = 'Đã hủy'
    
    let newInvoiceStatus = status;
    if (status === 'Chờ xác nhận') newInvoiceStatus = 'Chờ thanh toán';
    else if (status === 'Đang đối soát') newInvoiceStatus = 'Điều chỉnh';
    
    await prisma.invoice.update({
      where: { id },
      data: { 
        status: newInvoiceStatus,
        paymentDate: status === 'Đã thanh toán' ? new Date() : undefined
      }
    });

    return { success: true, message: `Cập nhật giao dịch thành: ${status}` };
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái giao dịch:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}
