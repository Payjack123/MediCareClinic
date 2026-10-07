import React from 'react';
import prisma from '@/lib/prisma';
import CoordinatorAppointmentsClient from './client';

export const dynamic = 'force-dynamic';

export default async function CoordinatorAppointments() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  // 1. Fetch DoctorSchedules (Lịch khám)
  const schedulesData = await prisma.doctorSchedule.findMany({
    orderBy: { date: 'desc' },
    include: {
      doctor: { select: { fullName: true } },
      clinic: { include: { specialty: true, facility: true } }
    }
  });

  const schedulesWithBookings = await Promise.all(schedulesData.map(async (s) => {
    // Xác định trạng thái dựa trên ngày
    let status = 'Hoạt động';
    if (s.date > todayStr) status = 'Sắp diễn ra';
    else if (s.date < todayStr) status = 'Đã kết thúc';

    // Lấy danh sách lịch hẹn của ca này
    const bookings = await prisma.appointment.findMany({
      where: {
        doctorId: s.doctorId,
        bookingDate: s.date
      },
      include: { patient: { select: { fullName: true } } }
    });

    let timeSlotsArr: string[] = [];
    if (s.timeSlots) {
      if (typeof s.timeSlots === 'string') {
        try { timeSlotsArr = JSON.parse(s.timeSlots); } catch(e) {}
      } else if (Array.isArray(s.timeSlots)) {
        timeSlotsArr = s.timeSlots as string[];
      }
    }
    
    // Format thời gian hiển thị (Giờ bắt đầu - Giờ kết thúc)
    let timeDisplay = 'Chưa xếp giờ';
    if (timeSlotsArr.length > 0) {
      const first = timeSlotsArr[0];
      const last = timeSlotsArr[timeSlotsArr.length - 1];
      // Đoán giờ kết thúc bằng cách +30 phút cho slot cuối
      timeDisplay = `${first} - ...`; // Rút gọn cho UI
    }

    // Format ngày DD/MM/YYYY
    const [y, m, d] = s.date.split('-');
    const formattedDate = `${d}/${m}/${y}`;

    return {
      id: s.id.toString(),
      date: formattedDate, 
      time: timeDisplay,
      doctor: s.doctor?.fullName || 'Bác sĩ ẩn',
      doctorId: s.doctorId,
      dept: s.clinic?.specialty?.name || 'Đa khoa',
      room: s.clinic?.roomNumber ? `P${s.clinic.roomNumber}` : (s.clinic?.name || 'Chưa xếp phòng'),
      facility: s.clinic?.facility?.name || 'Cơ sở chính',
      status: status,
      bookings: bookings.map(b => ({
        id: b.appointmentCode || b.id.toString(),
        patient: b.patient?.fullName || 'Bệnh nhân',
        time: b.bookingTime,
        status: b.status
      }))
    };
  }));

  // 2. Fetch danh mục để đẩy vào form tạo mới
  const doctors = await prisma.doctorProfile.findMany({
    include: { user: { select: { fullName: true } } }
  });

  const clinics = await prisma.clinic.findMany();
  const specialties = await prisma.specialty.findMany();
  const facilities = await prisma.facility.findMany();

  return (
    <CoordinatorAppointmentsClient 
      initialSchedules={schedulesWithBookings}
      doctors={doctors}
      clinics={clinics}
      specialties={specialties}
      facilities={facilities}
    />
  );
}
