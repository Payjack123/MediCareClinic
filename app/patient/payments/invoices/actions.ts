'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// 1. TỔNG HỢP DANH SÁCH HÓA ĐƠN & CHI PHÍ TỪ TIDB
export async function getPatientBillingData() {
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
        appointmentsAsPatient: {
          include: {
            doctor: { include: { doctorProfile: true } },
            examination: true,
            invoice: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        prescriptions: { include: { items: true } },
        labTests: true,
      },
    });

    if (!patient) {
      return { success: false, message: 'Không tìm thấy thông tin bệnh nhân' };
    }

    // Tự động đồng bộ hóa đơn thật: nếu lịch khám nào chưa có hóa đơn thì tạo hóa đơn
    for (const [idx, apt] of patient.appointmentsAsPatient.entries()) {
      if (!apt.invoice) {
        // Tính tiền khám (Chỉ tính nếu chưa thanh toán tại quầy lễ tân)
        const basePrice = apt.paymentStatus === 'ĐÃ THANH TOÁN' ? 0 : (apt.doctor.doctorProfile?.price || 150000);

        // Tính tiền xét nghiệm thực tế (dựa vào notes hoặc testsDetail)
        let labCost = 0;
        let labTestCount = 0;
        // Tìm các xét nghiệm trong cùng ngày với lịch khám (hoặc lấy tất cả nếu dữ liệu mẫu ít)
        const aptDateStr = new Date(apt.createdAt).toISOString().split('T')[0];
        const relatedLabTests = patient.labTests.filter(t => new Date(t.date).toISOString().split('T')[0] === aptDateStr);
        relatedLabTests.forEach(test => {
          labTestCount++;
          if (test.testsDetail && Array.isArray(test.testsDetail)) {
            test.testsDetail.forEach((detail: any) => {
              if (detail.price) labCost += Number(detail.price);
            });
          } else if (test.notes) {
            try {
              const notesObj = JSON.parse(test.notes);
              if (notesObj.totalPrice) labCost += Number(notesObj.totalPrice);
              else if (notesObj.testsDetail && Array.isArray(notesObj.testsDetail)) {
                notesObj.testsDetail.forEach((d: any) => { if (d.price) labCost += Number(d.price); });
              }
            } catch (e) { }
          }
        });
        if (labTestCount > 0 && labCost === 0) labCost = labTestCount * 150000; // fallback

        // Tính tiền thuốc thực tế
        let medCost = 0;
        let medCount = 0;
        const relatedPrescriptions = patient.prescriptions.filter(p => new Date(p.createdAt).toISOString().split('T')[0] === aptDateStr);
        relatedPrescriptions.forEach(prescription => {
          if (prescription.items) {
            prescription.items.forEach(item => {
              medCount++;
              medCost += item.price || 0;
            });
          }
        });

        const rawTotal = basePrice + labCost + medCost;
        const insuranceDiscount = patient.patientProfile?.bhyt ? Math.round(basePrice * 0.2) : 0;
        const finalAmount = rawTotal - insuranceDiscount;

        let invoiceStatus = 'Chưa thanh toán';
        // Nếu chỉ có phí khám và đã thanh toán tại quầy, hoá đơn coi như Đã thanh toán (hoặc không sinh ra). 
        // Nếu có phát sinh thêm lab/med thì phải chờ thanh toán phần còn lại.
        if (apt.status === 'HOÀN THÀNH' && rawTotal === 0) invoiceStatus = 'Đã thanh toán';
        else if (apt.status === 'ĐÃ HỦY') invoiceStatus = 'Hủy';

        const invoiceItems = [];
        if (basePrice > 0) invoiceItems.push({ name: 'Khám chuyên khoa', price: basePrice, quantity: 1, total: basePrice });
        if (labCost > 0) invoiceItems.push({ name: `Xét nghiệm cận lâm sàng (${labTestCount} chỉ định)`, price: labCost, quantity: 1, total: labCost });
        if (medCost > 0) invoiceItems.push({ name: `Tiền thuốc theo đơn (${medCount} loại)`, price: medCost, quantity: 1, total: medCost });

        await prisma.invoice.create({
          data: {
            invoiceCode: `HD${apt.id.toString().padStart(3, '0')}`,
            appointmentId: apt.id,
            patientId: patient.id,
            doctorId: apt.doctorId,
            totalAmount: rawTotal,
            insuranceAmount: insuranceDiscount,
            finalAmount: finalAmount,
            status: invoiceStatus,
            items: {
              create: invoiceItems
            }
          }
        });
      }
    }

    // Lấy lại danh sách hóa đơn từ Database thật
    const finalInvoices = await prisma.invoice.findMany({
      where: { patientId },
      include: {
        items: true,
        doctor: { include: { doctorProfile: true } },
        appointment: true
      },
      orderBy: { createdAt: 'desc' },
    });

    let paidCount = 0;
    let unpaidCount = 0;
    let totalExpense = 0;
    let overdueInvoice: any = null;

    const formattedInvoices = finalInvoices.map((inv, idx) => {
      let statusColor = 'text-yellow-700 bg-yellow-100 border-yellow-200';
      let uiStatus = inv.status;

      if (inv.status === 'Đã thanh toán') {
        statusColor = 'text-green-700 bg-green-100 border-green-200';
        paidCount++;
        totalExpense += inv.finalAmount;
      } else if (inv.status === 'Hủy') {
        statusColor = 'text-gray-500 bg-gray-100 border-gray-200';
      } else {
        unpaidCount++;
        if (idx === 0 && unpaidCount === 1) {
          overdueInvoice = {
            id: inv.invoiceCode,
            amount: inv.finalAmount.toLocaleString('vi-VN'),
          };
        }
      }

      const invoiceDate = inv.appointment?.bookingDate || inv.createdAt.toLocaleDateString('vi-VN');

      return {
        id: inv.invoiceCode,
        rawId: inv.id,
        date: invoiceDate,
        dueDate: invoiceDate,
        facility: 'Phòng khám đa khoa MediCare',
        doctor: `BS. ${inv.doctor?.fullName || 'N/A'}`,
        specialty: inv.appointment?.specialty || 'Nội tổng quát',
        total: inv.totalAmount.toLocaleString('vi-VN'),
        insurance: inv.insuranceAmount.toLocaleString('vi-VN'),
        final: inv.finalAmount.toLocaleString('vi-VN'),
        finalRaw: inv.finalAmount,
        status: uiStatus,
        statusColor,
        details: inv.items.map(item => ({
          name: item.name,
          price: item.price.toLocaleString('vi-VN'),
        })),
        paymentDate: inv.status === 'Đã thanh toán' ? `${invoiceDate} - 10:30` : 'Chưa có',
        paymentRef: inv.paymentRef || `VNPay-TXN${inv.id}9823`,
      };
    });

    const kpis = {
      totalInvoices: formattedInvoices.length,
      paidCount,
      unpaidCount,
      totalExpense: totalExpense.toLocaleString('vi-VN'),
      overdueInvoice,
    };

    return {
      success: true,
      data: {
        patientInfo: {
          name: patient.fullName,
          code: patient.patientProfile?.patientCode || `BN${patient.id.toString().padStart(4, '0')}`,
          avatar: patient.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.fullName)}&background=2563EB&color=fff`,
          dob: patient.dob ? (patient.dob.includes('-') ? patient.dob.split('-').reverse().join('/') : patient.dob) : 'Chưa cập nhật',
        },
        invoices: formattedInvoices,
        kpis,
      },
    };
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu viện phí:', error);
    return { success: false, message: 'Lỗi hệ thống khi tải hóa đơn' };
  }
}

// 2. XÁC NHẬN THANH TOÁN HÓA ĐƠN
export async function confirmInvoicePayment(rawId: number) {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;

    if (!userIdStr) {
      return { success: false, message: 'Chưa đăng nhập hệ thống' };
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: rawId },
    });

    if (!invoice) {
      await prisma.appointment.update({
        where: { id: rawId },
        data: { paymentStatus: 'ĐÃ THANH TOÁN', status: 'HOÀN THÀNH' },
      });
      return { success: true, message: 'Thanh toán viện phí thành công!' };
    }

    await prisma.invoice.update({
      where: { id: rawId },
      data: { status: 'Đã thanh toán', paymentDate: new Date(), paymentMethod: 'Tiền mặt' },
    });

    if (invoice.appointmentId) {
      await prisma.appointment.update({
        where: { id: invoice.appointmentId },
        data: { paymentStatus: 'ĐÃ THANH TOÁN', status: 'HOÀN THÀNH' },
      });
    }

    return { success: true, message: 'Thanh toán viện phí thành công!' };
  } catch (error) {
    console.error('Lỗi thanh toán hóa đơn:', error);
    return { success: false, message: 'Không thể xác nhận giao dịch lúc này' };
  }
}