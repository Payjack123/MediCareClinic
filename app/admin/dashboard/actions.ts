// app/admin/dashboard/actions.ts
'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import dayjs from 'dayjs';

export async function getAdminDashboardData() {
  try {
    // 1. Kiểm tra quyền Admin
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    const userRole = cookieStore.get('user_role')?.value;

    if (!userIdStr || userRole !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    // 2. Lấy các chỉ số KPI tổng quan
    const [
      totalPatients,
      totalAppointments,
      totalInvoices
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'PATIENT' } }),
      prisma.appointment.count(),
      prisma.invoice.count()
    ]);

    const invoices = await prisma.invoice.findMany({
      select: { finalAmount: true }
    });
    
    // Tổng doanh thu từ tất cả hóa đơn (có thể điều chỉnh logic chỉ lấy hóa đơn đã thanh toán)
    const totalRevenue = invoices.reduce((acc, curr) => acc + curr.finalAmount, 0);

    // 3. Cơ cấu bệnh nhân (hoặc lịch hẹn) theo khoa
    const apptsBySpec = await prisma.appointment.groupBy({
      by: ['specialty'],
      _count: { specialty: true },
      orderBy: { _count: { specialty: 'desc' } },
      take: 6
    });
    
    const patientsBySpecialty = apptsBySpec.map(s => ({
      name: s.specialty || 'Khác',
      percentage: totalAppointments > 0 ? Math.round((s._count.specialty / totalAppointments) * 100) : 0
    }));

    // 4. Doanh thu theo khoa
    // Vì bảng Invoice liên kết với Appointment, ta cần lấy thông qua Appointment
    const invoicesWithAppt = await prisma.invoice.findMany({
      include: { appointment: true },
      where: { status: 'Đã thanh toán' }
    });

    const revenueMap: Record<string, number> = {};
    invoicesWithAppt.forEach(inv => {
      const spec = inv.appointment?.specialty || 'Khác';
      revenueMap[spec] = (revenueMap[spec] || 0) + inv.finalAmount;
    });

    const revenueBySpecialty = Object.entries(revenueMap).map(([name, amount]) => ({
      name,
      amount
    })).sort((a, b) => b.amount - a.amount).slice(0, 5);

    // 5. Lịch khám 7 ngày qua (để vẽ biểu đồ)
    const today = dayjs();
    const last7Days = Array.from({ length: 7 }).map((_, i) => today.subtract(6 - i, 'day').format('YYYY-MM-DD'));
    
    const apptsLast7Days = await prisma.appointment.findMany({
      where: {
        bookingDate: {
          in: last7Days
        }
      },
      select: { bookingDate: true }
    });

    const apptCountByDayMap: Record<string, number> = {};
    apptsLast7Days.forEach(a => {
      apptCountByDayMap[a.bookingDate] = (apptCountByDayMap[a.bookingDate] || 0) + 1;
    });

    const appointmentsByDay = last7Days.map(date => ({
      day: dayjs(date).format('DD/MM'),
      count: apptCountByDayMap[date] || 0
    }));

    // 6. Lịch hẹn sắp tới
    const upcomingAppointmentsRaw = await prisma.appointment.findMany({
      take: 5,
      orderBy: [
        { bookingDate: 'asc' },
        { bookingTime: 'asc' }
      ],
      where: {
        status: { notIn: ['HOÀN THÀNH', 'ĐÃ HỦY'] }
      },
      include: {
        patient: true,
        doctor: true
      }
    });

    const upcomingAppointments = upcomingAppointmentsRaw.map(app => ({
      id: app.id,
      time: app.bookingTime,
      patientCode: `BN${app.patientId.toString().padStart(5, '0')}`,
      patientName: app.patient.fullName,
      doctorName: app.doctor.fullName,
      status: app.status
    }));

    // 7. Hóa đơn gần đây
    const recentInvoicesRaw = await prisma.invoice.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { patient: true }
    });

    const recentInvoices = recentInvoicesRaw.map(inv => ({
      id: inv.id,
      invoiceCode: inv.invoiceCode,
      patientName: inv.patient.fullName,
      amount: inv.finalAmount,
      status: inv.status
    }));

    // 8. Thông báo hệ thống
    const recentNotifications = await prisma.notification.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        message: true,
        type: true,
        createdAt: true
      }
    });

    return {
      success: true,
      data: {
        kpis: {
          patients: totalPatients,
          appointments: totalAppointments,
          revenue: totalRevenue,
          invoices: totalInvoices
        },
        patientsBySpecialty,
        revenueBySpecialty,
        appointmentsByDay,
        upcomingAppointments,
        recentInvoices,
        recentNotifications
      }
    };
  } catch (error) {
    console.error("Lỗi lấy dữ liệu Admin:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}