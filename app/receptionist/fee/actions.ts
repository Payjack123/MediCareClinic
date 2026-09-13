'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function searchInvoice(query: string) {
  try {
    if (!query) {
      return { success: false, message: 'Vui lòng nhập từ khóa tìm kiếm' };
    }

    // Find invoices matching the query (Invoice Code, Patient Phone, or Patient Code)
    // We prioritize unpaid invoices
    const invoices = await prisma.invoice.findMany({
      where: {
        OR: [
          { invoiceCode: { contains: query } },
          { patient: { phone: { contains: query } } },
          { patient: { patientProfile: { patientCode: { contains: query } } } },
        ],
        status: { in: ['Chờ thanh toán', 'CHƯA THANH TOÁN'] }
      },
      include: {
        patient: {
          include: {
            patientProfile: true
          }
        },
        items: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (invoices.length === 0) {
      return { success: false, message: 'Không tìm thấy hóa đơn chưa thanh toán nào phù hợp.' };
    }

    // Return the first matching invoice
    const invoice = invoices[0];
    
    // Check if patient has insurance
    const hasInsurance = !!invoice.patient.patientProfile?.bhyt;

    const data = {
      id: invoice.id,
      invoiceCode: invoice.invoiceCode,
      patient: {
        id: invoice.patient.patientProfile?.patientCode || `BN${invoice.patient.id}`,
        name: invoice.patient.fullName,
        phone: invoice.patient.phone || 'Chưa cập nhật',
        insurance: hasInsurance,
        bhytCode: invoice.patient.patientProfile?.bhyt
      },
      items: invoice.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.total,
        type: 'service' // Defaulting type
      })),
      totalAmount: invoice.totalAmount,
      insuranceAmount: invoice.insuranceAmount,
      finalAmount: invoice.finalAmount,
    };

    return { success: true, data };
  } catch (error) {
    console.error('Error searching invoice:', error);
    return { success: false, message: 'Lỗi hệ thống khi tìm kiếm hóa đơn.' };
  }
}

export async function payInvoice(invoiceId: number, paymentMethod: string) {
  try {
    // Map payment method ID to display name
    const paymentMethodMap: Record<string, string> = {
      cash: 'Tiền mặt',
      transfer: 'Chuyển khoản',
      qr: 'QR Code',
      card: 'Thẻ POS'
    };

    const method = paymentMethodMap[paymentMethod] || 'Khác';

    // Update invoice
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'Đã thanh toán',
        paymentMethod: method,
        paymentDate: new Date(),
        paymentRef: `TXN${Date.now()}` // Generate a simple transaction ref
      },
      include: {
        appointment: true
      }
    });

    // If invoice is linked to an appointment, update appointment payment status as well
    if (updatedInvoice.appointmentId) {
      await prisma.appointment.update({
        where: { id: updatedInvoice.appointmentId },
        data: {
          paymentStatus: 'ĐÃ THANH TOÁN',
          paymentMethod: method
        }
      });
    }

    revalidatePath('/receptionist/fee');
    
    return { 
      success: true, 
      message: 'Thanh toán thành công',
      invoiceCode: updatedInvoice.invoiceCode
    };
  } catch (error) {
    console.error('Error paying invoice:', error);
    return { success: false, message: 'Lỗi hệ thống khi xử lý thanh toán.' };
  }
}
