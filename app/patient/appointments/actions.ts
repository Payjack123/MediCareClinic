'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// 1. Lấy dữ liệu khởi tạo cho trang Đặt lịch Bệnh nhân
export async function getPatientAppointmentData() {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };
    
    const userId = parseInt(userIdStr);

    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      select: { id: true, fullName: true, phone: true, address: true, patientProfile: true } 
    });

    if (user && (!user.patientProfile?.patientCode || user.patientProfile?.patientCode === 'BN-NEW')) {
      const generatedCode = `BN${new Date().getFullYear().toString().slice(-2)}${user.id.toString().padStart(4, '0')}`;
      await prisma.patientProfile.upsert({
        where: { userId: userId },
        update: { patientCode: generatedCode },
        create: { userId: userId, patientCode: generatedCode }
      });
    }

    const [doctors, history] = await Promise.all([
      prisma.user.findMany({
        where: { role: 'DOCTOR' },
        include: { doctorProfile: true }
      }),
      prisma.appointment.findMany({
        where: { patientId: userId },
        orderBy: { createdAt: 'desc' },
        include: { 
          doctor: { 
            select: { 
              fullName: true, 
              avatar: true, 
              doctorProfile: { select: { specialty: true } } 
            } 
          } 
        }
      })
    ]);

    return { success: true, data: { user, doctors, history } };
  } catch (error) {
    console.error('Lỗi lấy dữ liệu đặt lịch:', error);
    return { success: false, message: 'Lỗi server' };
  }
}

// 2. Lấy các khung giờ ĐÃ BỊ ĐẶT
export async function getBookedTimes(doctorId: number, date: string) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { doctorId, bookingDate: date, status: { not: 'ĐÃ HỦY' } },
      select: { bookingTime: true }
    });
    return { success: true, bookedTimes: appointments.map(a => a.bookingTime) };
  } catch (error) {
    return { success: false, bookedTimes: [] };
  }
}

// 3. XÁC NHẬN ĐẶT LỊCH
export async function createAppointment(data: { doctorId: number, specialty: string, date: string, time: string, reason: string, status?: string, paymentMethod?: string }) {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;
    if (!userIdStr) return { success: false, message: 'Chưa đăng nhập' };

    // Sinh mã lịch hẹn tự động
    const generatedCode = `LH${Date.now().toString().slice(-6)}${Math.floor(10 + Math.random() * 90)}`;
    const paymentMethod = data.paymentMethod || 'TẠI QUẦY';
    const paymentStatus = paymentMethod === 'CHUYỂN KHOẢN' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN';

    const newApt = await prisma.appointment.create({
      data: {
        patientId: parseInt(userIdStr),
        doctorId: data.doctorId,
        specialty: data.specialty,
        bookingDate: data.date,
        bookingTime: data.time,
        reason: data.reason,
        status: data.status || 'CHỜ XÁC NHẬN',
        appointmentCode: generatedCode,
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus
      } as any // Use 'any' temporarily to avoid TS errors until prisma generate is recognized
    });

    return { success: true, appointmentCode: generatedCode };
  } catch (error) {
    console.error('Lỗi đặt lịch:', error);
    return { success: false, message: 'Không thể đặt lịch lúc này.' };
  }
}

// 4. LẤY HỒ SƠ CÔNG KHAI CỦA BÁC SĨ (MỚI THÊM)
export async function getPublicDoctorProfile(doctorId: number) {
  try {
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId, role: 'DOCTOR' },
      include: {
        doctorProfile: true,
        appointmentsAsDoctor: { select: { id: true, status: true } },
      }
    });

    if (!doctor) return { success: false, message: 'Không tìm thấy thông tin bác sĩ này' };

    const uniquePatients = new Set(await prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      select: { patientId: true }
    }));

    const dProfile = doctor.doctorProfile || {} as any;

    let parsedSchedule = [];
    if (dProfile.schedule) {
      if (typeof dProfile.schedule === 'string') {
        try { parsedSchedule = JSON.parse(dProfile.schedule); } catch (e) {}
      } else if (Array.isArray(dProfile.schedule)) {
        parsedSchedule = dProfile.schedule;
      }
    }

    const profileData = {
      id: `BS${doctor.id.toString().padStart(3, '0')}`,
      fullName: doctor.fullName,
      gender: doctor.gender || 'Nam',
      avatar: doctor.avatar || `https://ui-avatars.com/api/?name=${doctor.fullName.replace(/ /g, '+')}&background=2563EB&color=fff`,
      
      specialty: dProfile.specialty || 'Đa khoa',
      status: dProfile.status || 'Đang làm việc',
      degree: dProfile.degree || 'Chưa cập nhật',
      university: dProfile.university || 'Chưa cập nhật',
      experience: parseInt(dProfile.experience) || 0,
      languages: dProfile.languages || 'Chưa cập nhật',
      rating: dProfile.rating || 5.0,
      
      certificates: dProfile.certificates || [],
      schedule: parsedSchedule,
      
      stats: {
        totalPatients: uniquePatients.size,
        totalAppointments: doctor.appointmentsAsDoctor.length,
      },
      reviews: [
        { id: 1, name: 'Trần Thị H.', rating: 5, comment: 'Bác sĩ rất tận tình, khám kỹ và dặn dò chu đáo.', date: 'Gần đây' },
        { id: 2, name: 'Nguyễn Văn M.', rating: 5, comment: 'Chuyên môn cao, phòng khám sạch sẽ.', date: 'Tháng trước' }
      ]
    };

    return { success: true, data: profileData };
  } catch (error) {
    return { success: false, message: 'Lỗi server' };
  }
}

// 5. TÌM KIẾM BỆNH NHÂN THEO SĐT / CCCD / MÃ
export async function findPatientByQuery(query: string) {
  try {
    const q = query.trim();
    if (!q) return { success: false, message: 'Vui lòng nhập thông tin tìm kiếm' };

    const patient = await prisma.user.findFirst({
      where: {
        role: 'PATIENT',
        OR: [
          { phone: q },
          { patientProfile: { cccd: q } },
          { patientProfile: { patientCode: q } }
        ]
      },
      select: {
        fullName: true,
        phone: true,
        address: true,
        patientProfile: true
      }
    });

    if (!patient) {
      return { success: false, message: 'Không tìm thấy hồ sơ phù hợp' };
    }

    return { success: true, data: patient };
  } catch (error) {
    console.error('Lỗi tìm kiếm bệnh nhân:', error);
    return { success: false, message: 'Lỗi server' };
  }
}