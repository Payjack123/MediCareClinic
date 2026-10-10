'use server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getPaymentHistoryData() {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    
    if (!userIdStr) {
      return { success: false, message: 'Chưa đăng nhập hệ thống' };
    }
    
    const patientId = parseInt(userIdStr, 10);

    const patient = await prisma.user.findUnique({
      where: { id: patientId },
      include: {
        patientProfile: true,
      },
    });

    if (!patient) {
      return { success: false, message: 'Không tìm thấy thông tin bệnh nhân' };
    }

    const patientInfo = {
      name: patient.fullName,
      code: patient.patientProfile?.patientCode || `BN${patient.id.toString().padStart(4, '0')}`,
      avatar: patient.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.fullName)}&background=2563EB&color=fff`,
    };

    // Fetch real invoices from the database
    const invoices = await prisma.invoice.findMany({
      where: { patientId },
      include: {
        appointment: true,
        doctor: {
          include: { doctorProfile: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    const randomMethods = [
      { method: 'Chuyển khoản', icon: 'Bank' },
      { method: 'Tiền mặt', icon: 'Cash' }
    ];

    const history = invoices.map((inv, idx) => {
      let statusColor = 'text-yellow-700 bg-yellow-100 border-yellow-200';
      let methodInfo = { method: 'Chưa thanh toán', icon: 'None' };

      if (inv.status === 'Đã thanh toán') {
        statusColor = 'text-green-700 bg-green-100 border-green-200';
        methodInfo = inv.paymentMethod ? { method: inv.paymentMethod, icon: 'None' } : randomMethods[inv.id % randomMethods.length];
      } else if (inv.status === 'Hủy') {
        statusColor = 'text-gray-500 bg-gray-100 border-gray-200';
      } else if (inv.status === 'Quá hạn') {
        statusColor = 'text-red-700 bg-red-100 border-red-200';
      } else {
        statusColor = 'text-orange-700 bg-orange-100 border-orange-200';
      }

      return {
        id: inv.invoiceCode,
        rawId: inv.id,
        date: inv.appointment?.bookingDate || inv.createdAt.toLocaleDateString('vi-VN'),
        content: `Khám bệnh - ${inv.appointment?.specialty || 'Nội tổng quát'}`,
        clinic: 'Phòng khám đa khoa',
        amount: `${inv.finalAmount.toLocaleString('vi-VN')} ₫`,
        status: inv.status,
        statusColor,
        method: methodInfo.method,
        methodIcon: methodInfo.icon
      };
    });

    return { 
      success: true, 
      data: { 
        patientInfo,
        history 
      } 
    };
  } catch (error) {
    console.error('Lỗi getPaymentHistoryData:', error);
    return { success: false, message: 'Lỗi server' };
  }
}

