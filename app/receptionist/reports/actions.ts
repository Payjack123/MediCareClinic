'use server';

import prisma from '@/lib/prisma';
import dayjs from 'dayjs';
import { revalidatePath } from 'next/cache';

export interface ReportFilterParams {
  preset?: 'today' | 'yesterday' | '7days' | 'month' | 'all' | 'custom';
  date?: string; // YYYY-MM-DD
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  specialty?: string;
  doctorId?: number;
}

// Convert YYYY-MM-DD to DD/MM/YYYY
function formatToDDMMYYYY(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

// Generate all DD/MM/YYYY and YYYY-MM-DD dates in a range
function getDatesInRange(startStr: string, endStr: string): { ddmm: string[]; iso: string[] } {
  const ddmm: string[] = [];
  const iso: string[] = [];
  
  let curr = dayjs(startStr);
  const end = dayjs(endStr);
  
  while (curr.isBefore(end) || curr.isSame(end, 'day')) {
    const formattedIso = curr.format('YYYY-MM-DD');
    const formattedDDMM = curr.format('DD/MM/YYYY');
    iso.push(formattedIso);
    ddmm.push(formattedDDMM);
    curr = curr.add(1, 'day');
  }
  
  return { ddmm, iso };
}

export async function getFilterOptions() {
  try {
    const [specialtiesData, doctorsData] = await Promise.all([
      prisma.specialty.findMany({ select: { id: true, name: true } }),
      prisma.user.findMany({
        where: { role: 'DOCTOR' },
        select: { id: true, fullName: true }
      })
    ]);

    return {
      success: true,
      data: {
        specialties: specialtiesData.map(s => s.name),
        doctors: doctorsData
      }
    };
  } catch (error) {
    console.error('Lỗi khi lấy filter options:', error);
    return { success: false, data: { specialties: [], doctors: [] } };
  }
}

export async function getReceptionistReportData(filters: ReportFilterParams = {}) {
  try {
    const now = dayjs();
    const todayStr = now.format('YYYY-MM-DD');
    
    let filterStartIso = todayStr;
    let filterEndIso = todayStr;
    let periodTitle = `Hôm nay (${now.format('DD/MM/YYYY')})`;

    const preset = filters.preset || (filters.startDate ? 'custom' : (filters.date ? 'custom' : 'today'));

    if (preset === 'today') {
      filterStartIso = todayStr;
      filterEndIso = todayStr;
      periodTitle = `Hôm nay, ngày ${now.format('DD/MM/YYYY')}`;
    } else if (preset === 'yesterday') {
      const yesterday = now.subtract(1, 'day');
      filterStartIso = yesterday.format('YYYY-MM-DD');
      filterEndIso = yesterday.format('YYYY-MM-DD');
      periodTitle = `Hôm qua, ngày ${yesterday.format('DD/MM/YYYY')}`;
    } else if (preset === '7days') {
      const past7 = now.subtract(6, 'day');
      filterStartIso = past7.format('YYYY-MM-DD');
      filterEndIso = todayStr;
      periodTitle = `7 ngày qua (${past7.format('DD/MM')} - ${now.format('DD/MM/YYYY')})`;
    } else if (preset === 'month') {
      const startOfMonth = now.startOf('month');
      filterStartIso = startOfMonth.format('YYYY-MM-DD');
      filterEndIso = todayStr;
      periodTitle = `Tháng này (${now.format('MM/YYYY')})`;
    } else if (preset === 'all') {
      filterStartIso = '2020-01-01';
      filterEndIso = now.add(1, 'year').format('YYYY-MM-DD');
      periodTitle = 'Tất cả thời gian';
    } else if (preset === 'custom') {
      if (filters.date) {
        filterStartIso = filters.date;
        filterEndIso = filters.date;
        periodTitle = `Ngày ${dayjs(filters.date).format('DD/MM/YYYY')}`;
      } else if (filters.startDate && filters.endDate) {
        filterStartIso = filters.startDate;
        filterEndIso = filters.endDate;
        periodTitle = `Từ ${dayjs(filters.startDate).format('DD/MM/YYYY')} đến ${dayjs(filters.endDate).format('DD/MM/YYYY')}`;
      }
    }

    // Prepare date lists for bookingDate query
    const { ddmm: dateListDDMM, iso: dateListIso } = getDatesInRange(filterStartIso, filterEndIso);
    const allDateMatchStrings = Array.from(new Set([...dateListDDMM, ...dateListIso]));

    // Query Appointment Where
    const apptWhere: any = {};
    if (preset !== 'all') {
      apptWhere.bookingDate = { in: allDateMatchStrings };
    }
    if (filters.specialty) {
      apptWhere.specialty = filters.specialty;
    }
    if (filters.doctorId) {
      apptWhere.doctorId = Number(filters.doctorId);
    }

    // Query Invoices Where
    const invoiceWhere: any = {};
    if (preset !== 'all') {
      invoiceWhere.createdAt = {
        gte: dayjs(filterStartIso).startOf('day').toDate(),
        lte: dayjs(filterEndIso).endOf('day').toDate()
      };
    }
    if (filters.doctorId) {
      invoiceWhere.doctorId = Number(filters.doctorId);
    }

    // If specialty filter is set, filter invoices through appointment
    if (filters.specialty) {
      invoiceWhere.appointment = { specialty: filters.specialty };
    }

    // Execute queries
    const [appointments, invoices, doctors] = await Promise.all([
      prisma.appointment.findMany({
        where: apptWhere,
        include: {
          patient: {
            include: { patientProfile: true }
          },
          doctor: true,
          invoice: true
        },
        orderBy: [
          { bookingDate: 'desc' },
          { bookingTime: 'asc' }
        ]
      }),
      prisma.invoice.findMany({
        where: invoiceWhere,
        include: {
          patient: {
            include: { patientProfile: true }
          },
          doctor: true,
          appointment: true,
          items: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.user.findMany({
        where: { role: 'DOCTOR' },
        select: { id: true, fullName: true }
      })
    ]);

    // 1. Calculate Reception Statuses
    const totalAppointments = appointments.length;

    const checkedInStatuses = ['ĐÃ XÁC NHẬN', 'ĐANG KHÁM', 'HOÀN THÀNH', 'Đã check-in', 'Đã khám', 'ĐÃ ĐẾN'];
    const waitingStatuses = ['CHỜ XÁC NHẬN', 'Đang chờ', 'Đã đặt', 'ĐÃ XÁC NHẬN'];
    const examiningStatuses = ['ĐANG KHÁM', 'Đang khám'];
    const completedStatuses = ['HOÀN THÀNH', 'Đã khám'];
    const cancelledStatuses = ['ĐÃ HỦY', 'Đã hủy', 'Không đến', 'Vắng mặt'];

    let checkedInCount = 0;
    let waitingCount = 0;
    let examiningCount = 0;
    let completedCount = 0;
    let cancelledCount = 0;
    let newPatientsCount = 0;
    let hasInsuranceCount = 0;

    appointments.forEach((apt) => {
      const s = (apt.status || '').toUpperCase();
      if (checkedInStatuses.some(status => status.toUpperCase() === s)) {
        checkedInCount++;
      }
      if (s === 'ĐANG KHÁM' || s === 'ĐANG KHAM') {
        examiningCount++;
      } else if (s === 'HOÀN THÀNH' || s === 'ĐÃ KHÁM') {
        completedCount++;
      } else if (s === 'ĐÃ HỦY' || s === 'HỦY' || s === 'VẮNG MẶT') {
        cancelledCount++;
      } else if (s === 'CHỜ XÁC NHẬN' || s === 'ĐÃ XÁC NHẬN' || s === 'ĐANG CHỜ') {
        waitingCount++;
      }

      if (apt.patient?.patientProfile?.bhyt) {
        hasInsuranceCount++;
      }
      // Check if patient profile indicates new or newly created
      if (apt.patient?.patientProfile?.patientCode === 'BN-NEW' || !apt.patient?.patientProfile?.patientCode) {
        newPatientsCount++;
      }
    });

    const checkInRate = totalAppointments > 0 ? Math.round((checkedInCount / totalAppointments) * 100) : 0;
    const completedRate = totalAppointments > 0 ? Math.round((completedCount / totalAppointments) * 100) : 0;

    // 2. Financial & Cashier Calculations
    let totalRevenue = 0; // Final amount collected
    let totalOriginalAmount = 0;
    let totalInsuranceAmount = 0;
    let pendingRevenue = 0;
    let paidInvoicesCount = 0;
    let pendingInvoicesCount = 0;

    let cashAmount = 0;
    let cashCount = 0;
    let transferAmount = 0;
    let transferCount = 0;
    let cardAmount = 0;
    let cardCount = 0;
    let otherAmount = 0;
    let otherCount = 0;

    invoices.forEach((inv) => {
      const isPaid = inv.status === 'Đã thanh toán' || inv.status === 'ĐÃ THANH TOÁN';
      if (isPaid) {
        paidInvoicesCount++;
        totalRevenue += inv.finalAmount || 0;
        totalOriginalAmount += inv.totalAmount || 0;
        totalInsuranceAmount += inv.insuranceAmount || 0;

        const method = (inv.paymentMethod || '').toLowerCase();
        if (method.includes('tiền mặt') || method.includes('cash')) {
          cashAmount += inv.finalAmount || 0;
          cashCount++;
        } else {
          // Còn lại tính vào chuyển khoản (VietQR / Ngân hàng)
          transferAmount += inv.finalAmount || 0;
          transferCount++;
        }
      } else {
        pendingInvoicesCount++;
        pendingRevenue += inv.finalAmount || 0;
      }
    });

    const totalCashierCollected = cashAmount + transferAmount;

    // 3. Hourly Traffic Distribution (07:00 to 18:00)
    const timeSlots = [
      { slot: '07:00 - 08:00', label: '07h - 08h', hour: 7, count: 0 },
      { slot: '08:00 - 09:00', label: '08h - 09h', hour: 8, count: 0 },
      { slot: '09:00 - 10:00', label: '09h - 10h', hour: 9, count: 0 },
      { slot: '10:00 - 11:00', label: '10h - 11h', hour: 10, count: 0 },
      { slot: '11:00 - 12:00', label: '11h - 12h', hour: 11, count: 0 },
      { slot: '13:00 - 14:00', label: '13h - 14h', hour: 13, count: 0 },
      { slot: '14:00 - 15:00', label: '14h - 15h', hour: 14, count: 0 },
      { slot: '15:00 - 16:00', label: '15h - 16h', hour: 15, count: 0 },
      { slot: '16:00 - 17:00', label: '16h - 17h', hour: 16, count: 0 },
      { slot: '17:00 - 18:00', label: '17h - 18h', hour: 17, count: 0 },
    ];

    appointments.forEach((apt) => {
      const timeStr = apt.bookingTime || '';
      // Extract starting hour: e.g. "08:30" or "08:00 - 08:30"
      const match = timeStr.match(/^(\d{1,2})/);
      if (match) {
        const hour = parseInt(match[1], 10);
        const slotObj = timeSlots.find(s => s.hour === hour);
        if (slotObj) {
          slotObj.count++;
        }
      }
    });

    const maxSlotCount = Math.max(...timeSlots.map(s => s.count), 1);
    const hourlyDistribution = timeSlots.map(s => ({
      ...s,
      percentage: Math.round((s.count / maxSlotCount) * 100),
      isPeak: s.count > 0 && s.count === maxSlotCount
    }));

    // 4. Specialty Breakdown
    const specialtyMap: Record<string, { count: number; revenue: number }> = {};
    appointments.forEach(apt => {
      const spec = apt.specialty || 'Khác';
      if (!specialtyMap[spec]) {
        specialtyMap[spec] = { count: 0, revenue: 0 };
      }
      specialtyMap[spec].count++;
    });

    invoices.forEach(inv => {
      if (inv.status === 'Đã thanh toán' || inv.status === 'ĐÃ THANH TOÁN') {
        const spec = inv.appointment?.specialty || 'Khám tổng quát';
        if (!specialtyMap[spec]) {
          specialtyMap[spec] = { count: 0, revenue: 0 };
        }
        specialtyMap[spec].revenue += inv.finalAmount || 0;
      }
    });

    const specialtiesList = Object.entries(specialtyMap)
      .map(([name, data]) => ({
        name,
        count: data.count,
        revenue: data.revenue,
        percentage: totalAppointments > 0 ? Math.round((data.count / totalAppointments) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    // 5. Doctor & Room Workload
    const doctorMap: Record<number, {
      id: number;
      name: string;
      specialty: string;
      room: string;
      patientCount: number;
      completedCount: number;
      waitingCount: number;
      revenue: number;
    }> = {};

    appointments.forEach(apt => {
      const docId = apt.doctorId;
      if (!doctorMap[docId]) {
        doctorMap[docId] = {
          id: docId,
          name: apt.doctor?.fullName || `Bác sĩ #${docId}`,
          specialty: apt.specialty || 'Chung',
          room: apt.room || 'Phòng 201',
          patientCount: 0,
          completedCount: 0,
          waitingCount: 0,
          revenue: 0
        };
      }
      doctorMap[docId].patientCount++;
      const s = (apt.status || '').toUpperCase();
      if (s === 'HOÀN THÀNH' || s === 'ĐÃ KHÁM') {
        doctorMap[docId].completedCount++;
      } else if (s === 'ĐÃ XÁC NHẬN' || s === 'CHỜ XÁC NHẬN') {
        doctorMap[docId].waitingCount++;
      }
    });

    invoices.forEach(inv => {
      if ((inv.status === 'Đã thanh toán' || inv.status === 'ĐÃ THANH TOÁN') && inv.doctorId) {
        if (doctorMap[inv.doctorId]) {
          doctorMap[inv.doctorId].revenue += inv.finalAmount || 0;
        }
      }
    });

    const doctorWorkload = Object.values(doctorMap).sort((a, b) => b.patientCount - a.patientCount);

    // 6. Formatted Invoice Ledger
    const invoicesList = invoices.map(inv => ({
      id: inv.id,
      invoiceCode: inv.invoiceCode,
      patientName: inv.patient?.fullName || 'N/A',
      patientCode: inv.patient?.patientProfile?.patientCode || `BN${inv.patientId}`,
      phone: inv.patient?.phone || 'N/A',
      doctorName: inv.doctor?.fullName || 'N/A',
      specialty: inv.appointment?.specialty || 'Khám bệnh',
      totalAmount: inv.totalAmount,
      insuranceAmount: inv.insuranceAmount,
      finalAmount: inv.finalAmount,
      paymentMethod: ((inv.paymentMethod || '').toLowerCase().includes('tiền mặt') || (inv.paymentMethod || '').toLowerCase().includes('cash')) ? 'Tiền mặt' : 'Chuyển khoản',
      paymentDate: inv.paymentDate ? dayjs(inv.paymentDate).format('DD/MM/YYYY HH:mm') : null,
      createdAt: dayjs(inv.createdAt).format('DD/MM/YYYY HH:mm'),
      status: inv.status,
      itemsCount: inv.items.length
    }));

    // 7. Formatted Appointments List
    const appointmentsList = appointments.map(apt => ({
      id: apt.id,
      code: apt.appointmentCode || `LH${apt.id}`,
      queueNumber: apt.queueNumber || '--',
      patientName: apt.patient?.fullName || 'N/A',
      patientCode: apt.patient?.patientProfile?.patientCode || `BN${apt.patientId}`,
      phone: apt.patient?.phone || 'N/A',
      doctorName: apt.doctor?.fullName || 'N/A',
      room: apt.room || 'Phòng khám',
      specialty: apt.specialty,
      bookingTime: apt.bookingTime,
      bookingDate: apt.bookingDate,
      status: apt.status,
      paymentStatus: apt.paymentStatus,
      paymentMethod: apt.paymentMethod,
      reason: apt.reason || 'Khám bệnh định kỳ'
    }));

    return {
      success: true,
      data: {
        periodTitle,
        filterDates: { start: filterStartIso, end: filterEndIso },
        kpis: {
          totalAppointments,
          checkedInCount,
          waitingCount,
          examiningCount,
          completedCount,
          cancelledCount,
          checkInRate,
          completedRate,
          totalRevenue,
          totalOriginalAmount,
          totalInsuranceAmount,
          pendingRevenue,
          totalInvoices: invoices.length,
          paidInvoicesCount,
          pendingInvoicesCount,
          newPatientsCount,
          hasInsuranceCount,
          noInsuranceCount: totalAppointments - hasInsuranceCount
        },
        cashierHandover: {
          cash: {
            amount: cashAmount,
            count: cashCount,
            percentage: totalRevenue > 0 ? Math.round((cashAmount / totalRevenue) * 100) : 0
          },
          transfer: {
            amount: transferAmount,
            count: transferCount,
            percentage: totalRevenue > 0 ? 100 - Math.round((cashAmount / totalRevenue) * 100) : 0
          },
          insuranceDeduction: {
            amount: totalInsuranceAmount,
            count: invoices.filter(i => i.insuranceAmount > 0).length
          },
          totalCollected: totalRevenue
        },
        hourlyDistribution,
        specialtiesList,
        doctorWorkload,
        invoicesList,
        appointmentsList,
        summary: {
          reportGeneratedAt: now.format('DD/MM/YYYY HH:mm:ss'),
          receptionistName: 'Nguyễn Thị Hương',
          clinicName: 'Phòng khám Đa khoa Quốc tế MediCare'
        }
      }
    };
  } catch (error) {
    console.error('Lỗi khi lấy báo cáo receptionist:', error);
    return {
      success: false,
      message: 'Đã có lỗi xảy ra khi tạo báo cáo lễ tân. Vui lòng thử lại!'
    };
  }
}

// Seed Demo Data for Today if today is empty or tester wants demo data
export async function seedTodayDemoData() {
  try {
    const todayFormatted = dayjs().format('DD/MM/YYYY');
    
    // Check if doctors and patients exist
    const [doctors, patients] = await Promise.all([
      prisma.user.findMany({ where: { role: 'DOCTOR' }, take: 4 }),
      prisma.user.findMany({ where: { role: 'PATIENT' }, take: 8 })
    ]);

    if (doctors.length === 0 || patients.length === 0) {
      return { success: false, message: 'Chưa có đủ bác sĩ hoặc bệnh nhân trong hệ thống để tạo mẫu' };
    }

    const demoSlots = [
      { time: '08:00 - 08:30', status: 'HOÀN THÀNH', room: 'P. 201', specialty: 'Nội tổng quát', method: 'Tiền mặt', price: 200000, ins: 40000 },
      { time: '08:30 - 09:00', status: 'HOÀN THÀNH', room: 'P. 202', specialty: 'Tim mạch', method: 'Chuyển khoản', price: 300000, ins: 60000 },
      { time: '09:00 - 09:30', status: 'HOÀN THÀNH', room: 'P. 203', specialty: 'Da liễu', method: 'Chuyển khoản', price: 250000, ins: 0 },
      { time: '09:30 - 10:00', status: 'ĐANG KHÁM', room: 'P. 201', specialty: 'Nội tổng quát', method: 'Tiền mặt', price: 200000, ins: 40000 },
      { time: '10:00 - 10:30', status: 'ĐÃ XÁC NHẬN', room: 'P. 204', specialty: 'Răng hàm mặt', method: 'Chuyển khoản', price: 350000, ins: 0 },
      { time: '10:30 - 11:00', status: 'CHỜ XÁC NHẬN', room: 'P. 202', specialty: 'Tim mạch', method: 'TẠI QUẦY', price: 300000, ins: 0 },
      { time: '14:00 - 14:30', status: 'CHỜ XÁC NHẬN', room: 'P. 201', specialty: 'Nội tổng quát', method: 'TẠI QUẦY', price: 200000, ins: 0 },
      { time: '14:30 - 15:00', status: 'ĐÃ HỦY', room: 'P. 203', specialty: 'Da liễu', method: 'TẠI QUẦY', price: 250000, ins: 0 }
    ];

    let createdCount = 0;

    for (let i = 0; i < demoSlots.length; i++) {
      const slot = demoSlots[i];
      const patient = patients[i % patients.length];
      const doctor = doctors[i % doctors.length];
      const aptCode = `LH${dayjs().format('YYMMDD')}${String(100 + i)}`;
      const queueNumber = `A${String(i + 1).padStart(3, '0')}`;

      // Check if already created today with this code
      const existing = await prisma.appointment.findUnique({
        where: { appointmentCode: aptCode }
      });

      if (!existing) {
        const apt = await prisma.appointment.create({
          data: {
            patientId: patient.id,
            doctorId: doctor.id,
            appointmentCode: aptCode,
            queueNumber: queueNumber,
            specialty: slot.specialty,
            bookingDate: todayFormatted,
            bookingTime: slot.time,
            room: slot.room,
            reason: `Khám theo yêu cầu chuyên khoa ${slot.specialty}`,
            status: slot.status,
            paymentMethod: slot.method,
            paymentStatus: slot.status === 'HOÀN THÀNH' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN'
          }
        });

        // Create invoice if paid
        if (slot.status === 'HOÀN THÀNH') {
          const invCode = `HD${apt.id}`;
          const finalAmt = slot.price - slot.ins;
          await prisma.invoice.create({
            data: {
              invoiceCode: invCode,
              appointmentId: apt.id,
              patientId: patient.id,
              doctorId: doctor.id,
              totalAmount: slot.price,
              insuranceAmount: slot.ins,
              finalAmount: finalAmt,
              status: 'Đã thanh toán',
              paymentMethod: slot.method,
              paymentDate: new Date(),
              paymentRef: `TXN${Date.now()}_${i}`,
              items: {
                create: [
                  {
                    name: `Công khám chuyên khoa ${slot.specialty}`,
                    price: slot.price,
                    quantity: 1,
                    total: slot.price
                  }
                ]
              }
            }
          });
        }
        createdCount++;
      }
    }

    revalidatePath('/receptionist/reports');
    return {
      success: true,
      message: `Đã khởi tạo thành công ${createdCount} lượt tiếp đón và hóa đơn mẫu cho ngày hôm nay!`
    };
  } catch (error) {
    console.error('Lỗi khi seed data:', error);
    return { success: false, message: 'Lỗi khi tạo dữ liệu mẫu' };
  }
}
