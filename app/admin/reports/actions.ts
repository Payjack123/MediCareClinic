// app/admin/reports/actions.ts
'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import dayjs from 'dayjs';

// Types for filters
export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  specialty?: string;
  doctorId?: number;
}

export async function getFilterOptions() {
  try {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('user_role')?.value;

    if (userRole !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    // Lấy danh sách Khoa (Specialties)
    const specialtiesData = await prisma.doctorProfile.findMany({
      select: { specialty: true },
      distinct: ['specialty']
    });
    const specialties = specialtiesData.map(s => s.specialty).filter(Boolean);

    // Lấy danh sách Bác sĩ
    const doctorsData = await prisma.user.findMany({
      where: { role: 'DOCTOR' },
      select: { id: true, fullName: true }
    });

    return {
      success: true,
      data: {
        specialties,
        doctors: doctorsData
      }
    };
  } catch (error) {
    console.error("Lỗi lấy danh sách filter:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}

export async function getAdminReportsData(filters: ReportFilters) {
  try {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('user_role')?.value;

    if (userRole !== 'admin') {
      return { success: false, message: 'Không có quyền truy cập' };
    }

    // Xây dựng điều kiện lọc (Where clause)
    const apptWhere: any = {};
    const invoiceWhere: any = {};
    const patientWhere: any = { role: 'PATIENT' };

    if (filters.startDate && filters.endDate) {
      // appt bookingDate is String "YYYY-MM-DD"
      apptWhere.bookingDate = {
        gte: filters.startDate,
        lte: filters.endDate
      };
      
      // Invoice createdAt is DateTime
      invoiceWhere.createdAt = {
        gte: dayjs(filters.startDate).startOf('day').toDate(),
        lte: dayjs(filters.endDate).endOf('day').toDate()
      };
    }

    if (filters.specialty) {
      apptWhere.specialty = filters.specialty;
      // Doanh thu cũng lọc theo khoa thông qua appointment
      invoiceWhere.appointment = { specialty: filters.specialty };
    }

    if (filters.doctorId) {
      apptWhere.doctorId = Number(filters.doctorId);
      invoiceWhere.doctorId = Number(filters.doctorId);
    }

    // 1. KPIs
    const [
      totalPatients, // Tổng BN trong hệ thống
      totalAppointments,
      totalInvoices,
      invoicesWithAppt
    ] = await Promise.all([
      prisma.user.count({ where: patientWhere }),
      prisma.appointment.count({ where: apptWhere }),
      prisma.invoice.count({ where: invoiceWhere }),
      prisma.invoice.findMany({
        where: { ...invoiceWhere, status: 'Đã thanh toán' },
        include: { appointment: true }
      })
    ]);

    const totalRevenue = invoicesWithAppt.reduce((acc, curr) => acc + curr.finalAmount, 0);

    // 2. Lượt khám theo ngày (Group by bookingDate)
    const apptsByDayRaw = await prisma.appointment.groupBy({
      by: ['bookingDate'],
      where: apptWhere,
      _count: { bookingDate: true },
      orderBy: { bookingDate: 'asc' }
    });

    const appointmentsByDay = apptsByDayRaw.map(a => ({
      day: dayjs(a.bookingDate).format('DD/MM'),
      count: a._count.bookingDate
    }));

    // 3. Cơ cấu Bệnh nhân theo Khoa (Dựa trên lịch hẹn)
    const apptsBySpec = await prisma.appointment.groupBy({
      by: ['specialty'],
      where: apptWhere,
      _count: { specialty: true },
      orderBy: { _count: { specialty: 'desc' } }
    });

    const patientsBySpecialty = apptsBySpec.map(s => ({
      name: s.specialty || 'Khác',
      percentage: totalAppointments > 0 ? Math.round((s._count.specialty / totalAppointments) * 100) : 0
    }));

    // 4. Doanh thu theo Khoa
    const revenueMap: Record<string, number> = {};
    invoicesWithAppt.forEach(inv => {
      const spec = inv.appointment?.specialty || 'Khác';
      revenueMap[spec] = (revenueMap[spec] || 0) + inv.finalAmount;
    });

    const revenueBySpecialty = Object.entries(revenueMap)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);

    return {
      success: true,
      data: {
        kpis: {
          patients: totalPatients,
          appointments: totalAppointments,
          revenue: totalRevenue,
          invoices: totalInvoices
        },
        appointmentsByDay,
        patientsBySpecialty,
        revenueBySpecialty
      }
    };
  } catch (error) {
    console.error("Lỗi lấy dữ liệu Admin Reports:", error);
    return { success: false, message: 'Lỗi máy chủ' };
  }
}
